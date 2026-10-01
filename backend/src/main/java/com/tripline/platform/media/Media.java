package com.tripline.platform.media;

import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.*;
import java.net.URI;
import java.util.*;
import javax.imageio.ImageIO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@RestController
@RequestMapping("/api/v1/admin/media")
class Media {
    private final JdbcTemplate db; private final Audit audit; private final String bucket,base; private final S3Client s3;
    Media(JdbcTemplate db,Audit audit,@Value("${tripline.r2-endpoint}") String endpoint,@Value("${tripline.r2-key}") String key,@Value("${tripline.r2-secret}") String secret,@Value("${tripline.r2-bucket}") String bucket,@Value("${tripline.r2-public-url}") String base) {
        this.db=db; this.audit=audit; this.bucket=bucket; this.base=base;
        s3=endpoint.isBlank()?null:S3Client.builder().endpointOverride(URI.create(endpoint)).region(Region.of("auto")).forcePathStyle(true).credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(key,secret))).build();
    }
    record Metadata(@NotBlank @Size(max=300) String alt) {}
    @GetMapping Object list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,@RequestParam(defaultValue="") String search) {
        String q="%"+search+"%"; return Lists.page(db.queryForList("SELECT * FROM media_assets WHERE filename ILIKE ? OR alt ILIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?",q,q,Lists.size(size),Lists.offset(page,size)),db.queryForObject("SELECT count(*) FROM media_assets WHERE filename ILIKE ? OR alt ILIKE ?",Long.class,q,q),page,size);
    }
    @PostMapping @Transactional Object upload(@RequestParam MultipartFile file,@RequestParam @NotBlank @Size(max=300) String alt) throws IOException {
        if(s3==null || base.isBlank()) throw new ApiException(503,"STORAGE_UNAVAILABLE","Media storage is not configured.");
        if(file.getSize()==0 || file.getSize()>10*1024*1024) throw new ApiException(413,"UPLOAD_SIZE","Upload an image up to 10 MB.");
        byte[] bytes=file.getBytes(); int width,height; String format;
        try(var stream=ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            var readers=ImageIO.getImageReaders(stream); if(!readers.hasNext()) throw new ApiException(400,"IMAGE_TYPE","Upload a supported JPEG, PNG or WebP image.");
            var reader=readers.next();
            try { reader.setInput(stream); width=reader.getWidth(0); height=reader.getHeight(0); format=reader.getFormatName().toLowerCase(Locale.ROOT);
                if(width<=0 || height<=0 || (long)width*height>40000000) throw new ApiException(400,"IMAGE_DIMENSIONS","Image must contain no more than 40 million pixels.");
                if(!Set.of("jpeg","jpg","png","webp").contains(format)) throw new ApiException(400,"IMAGE_TYPE","Upload JPEG, PNG or WebP.");
                reader.read(0);
            } finally { reader.dispose(); }
        }
        String mime="image/"+(format.equals("jpg")?"jpeg":format); UUID id=UUID.randomUUID(); String key="media/"+id+"."+format;
        String url=base.replaceAll("/$","")+"/"+key; String name=Optional.ofNullable(file.getOriginalFilename()).orElse("image"); if(name.length()>255) name=name.substring(name.length()-255);
        s3.putObject(b->b.bucket(bucket).key(key).contentType(mime).cacheControl("public,max-age=31536000,immutable"),software.amazon.awssdk.core.sync.RequestBody.fromBytes(bytes));
        try { db.update("INSERT INTO media_assets(id,object_key,url,filename,alt,mime_type,width,height,size_bytes) VALUES(?,?,?,?,?,?,?,?,?)",id,key,url,name,alt,mime,width,height,bytes.length); audit.record("MEDIA_UPLOAD","media",id); }
        catch(RuntimeException e) { s3.deleteObject(b->b.bucket(bucket).key(key)); throw e; }
        return db.queryForMap("SELECT * FROM media_assets WHERE id=?",id);
    }
    @PatchMapping("/{id}") @Transactional Object metadata(@PathVariable UUID id,@Valid @RequestBody Metadata input) { if(db.update("UPDATE media_assets SET alt=? WHERE id=?",input.alt(),id)==0) throw ApiException.missing(); audit.record("MEDIA_UPDATE","media",id); return db.queryForMap("SELECT * FROM media_assets WHERE id=?",id); }
    @GetMapping("/{id}/usage") Object usage(@PathVariable UUID id) { String url=url(id); return Map.of("references",references(url)); }
    private String url(UUID id) { var rows=db.queryForList("SELECT url FROM media_assets WHERE id=?",String.class,id); if(rows.isEmpty()) throw ApiException.missing(); return rows.getFirst(); }
    private long references(String url) {
        String q="%"+url+"%";
        return db.queryForObject("SELECT (SELECT count(*) FROM pages WHERE draft_content::text LIKE ? OR published_content::text LIKE ?) + (SELECT count(*) FROM services WHERE draft_content::text LIKE ? OR published_content::text LIKE ?)",Long.class,q,q,q,q);
    }
    @DeleteMapping("/{id}") @Transactional void delete(@PathVariable UUID id) {
        if(s3==null) throw new ApiException(503,"STORAGE_UNAVAILABLE","Media storage is not configured.");
        // Lock content writers while checking both snapshots; publication cannot race deletion.
        db.execute("LOCK TABLE pages,services IN SHARE ROW EXCLUSIVE MODE");
        String url=url(id); if(references(url)>0) throw new ApiException(409,"MEDIA_IN_USE","Remove this image from all drafts and published content before deleting it.");
        String key=db.queryForObject("SELECT object_key FROM media_assets WHERE id=?",String.class,id);
        s3.deleteObject(b->b.bucket(bucket).key(key)); db.update("DELETE FROM media_assets WHERE id=?",id); audit.record("MEDIA_DELETE","media",id);
    }
}
