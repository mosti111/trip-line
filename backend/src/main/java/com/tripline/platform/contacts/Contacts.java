package com.tripline.platform.contacts;

import com.tripline.platform.auth.RateLimits;
import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
class Contacts {
    private final JdbcTemplate db; private final Turnstile turnstile; private final RateLimits limits; private final Audit audit;
    Contacts(JdbcTemplate db,Turnstile turnstile,RateLimits limits,Audit audit) { this.db=db; this.turnstile=turnstile; this.limits=limits; this.audit=audit; }
    record Submission(@NotNull UUID requestId,@NotBlank @Size(max=120) String name,@NotBlank @Email @Size(max=254) String email,@Size(max=40) String phone,@Size(max=150) String company,@Size(max=200) String subject,@NotBlank @Size(min=10,max=10000) String message,@Size(max=100) String serviceInterest,@Size(max=500) String source,@NotNull @Size(max=5) Map<@Pattern(regexp="utm_source|utm_medium|utm_campaign|utm_term|utm_content") String,@Size(max=200) String> utm,@NotBlank @Size(max=2048) String turnstileToken) {}
    record Status(@NotBlank @Pattern(regexp="NEW|READ|REPLIED|ARCHIVED") String status) {}
    @PostMapping("/api/v1/public/contact") Object submit(@Valid @RequestBody Submission s,HttpServletRequest request) {
        limits.check("contact:"+request.getRemoteAddr(),10,Duration.ofHours(1));
        if(db.queryForObject("SELECT count(*) FROM contact_submissions WHERE request_id=?",Long.class,s.requestId())>0) return Map.of("accepted",true);
        turnstile.verify(s.turnstileToken());
        db.update("INSERT INTO contact_submissions(id,request_id,name,email,phone,company,subject,message,service_interest,source,utm) VALUES(?,?,?,?,?,?,?,?,?,?,?::jsonb) ON CONFLICT(request_id) DO NOTHING",UUID.randomUUID(),s.requestId(),s.name(),s.email(),s.phone(),s.company(),s.subject(),s.message(),s.serviceInterest(),s.source(),Json.write(s.utm()));
        return Map.of("accepted",true);
    }
    @GetMapping("/api/v1/admin/messages") Object list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,@RequestParam(defaultValue="") String search,@RequestParam(defaultValue="") String status) {
        String q="%"+search+"%"; String where=" WHERE (name ILIKE ? OR email ILIKE ? OR subject ILIKE ?) AND (?='' OR status=?)";
        return Lists.page(db.queryForList("SELECT id,name,email,phone,company,subject,status,created_at FROM contact_submissions"+where+" ORDER BY created_at DESC LIMIT ? OFFSET ?",q,q,q,status,status,Lists.size(size),Lists.offset(page,size)),db.queryForObject("SELECT count(*) FROM contact_submissions"+where,Long.class,q,q,q,status,status),page,size);
    }
    @GetMapping("/api/v1/admin/messages/{id}") Object detail(@PathVariable UUID id) { var rows=db.queryForList("SELECT * FROM contact_submissions WHERE id=?",id); if(rows.isEmpty()) throw ApiException.missing(); return rows.getFirst(); }
    @Transactional @PatchMapping("/api/v1/admin/messages/{id}") Object status(@PathVariable UUID id,@Valid @RequestBody Status input) { if(db.update("UPDATE contact_submissions SET status=?,updated_at=now() WHERE id=?",input.status(),id)==0) throw ApiException.missing(); audit.record("MESSAGE_UPDATE","contact",id); return detail(id); }
}
