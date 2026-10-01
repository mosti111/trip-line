package com.tripline.platform.settings;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import com.tripline.platform.shared.*;
import com.tripline.platform.audit.Audit;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteSettings {
    public record Social(@NotBlank @Size(max=40) String label,@NotBlank @Pattern(regexp="https://[^\\s]+") String url) {}
    public record Value(@NotBlank @Size(max=100) String companyName,@Size(max=200) String tagline,@Email @Size(max=254) String email,@Size(max=40) String phone,@Size(max=40) String whatsapp,@Size(max=500) String address,@Size(max=300) String footerText,@NotNull @Size(max=10) List<@Valid Social> socials,@NotBlank @Size(max=100) String seoTitle,@Size(max=300) String seoDescription,@NotBlank String timezone,@NotBlank @Pattern(regexp="en") String locale) {}
    private final JdbcTemplate db; private final Audit audit;
    public SiteSettings(JdbcTemplate db,Audit audit) { this.db=db; this.audit=audit; }
    public Value value() { return Json.read(db.queryForObject("SELECT content::text FROM site_settings WHERE id=1",String.class),Value.class); }
    public Object admin() { return Map.of("content",value(),"version",db.queryForObject("SELECT version FROM site_settings WHERE id=1",Long.class)); }
    @Transactional public Object save(Value value,long version) {
        java.time.ZoneId.of(value.timezone());
        if(db.update("UPDATE site_settings SET content=?::jsonb,version=version+1 WHERE id=1 AND version=?",Json.write(value),version)==0) throw ApiException.conflict();
        audit.record("SETTINGS_UPDATE","settings",1); return admin();
    }
}
