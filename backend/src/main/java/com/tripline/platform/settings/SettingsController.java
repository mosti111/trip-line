package com.tripline.platform.settings;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
class SettingsController {
    private final SiteSettings settings; private final JdbcTemplate db;
    SettingsController(SiteSettings settings,JdbcTemplate db) { this.settings=settings; this.db=db; }
    record Update(long version,@NotNull @Valid SiteSettings.Value content) {}
    @GetMapping("/api/v1/public/site") Object site() { return settings.value(); }
    @GetMapping("/api/v1/public/navigation") Object navigation() { return List.of(Map.of("label","Home","href","/"),Map.of("label","About","href","/about"),Map.of("label","Services","href","/services"),Map.of("label","Contact","href","/contact")); }
    @GetMapping("/api/v1/admin/settings") Object admin() { return settings.admin(); }
    @PatchMapping("/api/v1/admin/settings") Object save(@RequestBody @Valid Update input) { return settings.save(input.content(),input.version()); }
    @GetMapping("/api/v1/admin/roles") Object roles() { return List.of("SUPER_ADMIN","ADMIN","EDITOR"); }
    @GetMapping("/api/v1/admin/dashboard") Object dashboard() {
        return Map.of("services",db.queryForObject("SELECT count(*) FROM services WHERE published_content IS NOT NULL AND NOT archived AND published_content->>'enabled'='true'",Long.class),
            "newMessages",db.queryForObject("SELECT count(*) FROM contact_submissions WHERE status='NEW'",Long.class),
            "messages",db.queryForObject("SELECT count(*) FROM contact_submissions",Long.class),
            "publishedPages",db.queryForObject("SELECT count(*) FROM pages WHERE published_content IS NOT NULL AND published_content->>'enabled'='true'",Long.class),
            "recentMessages",db.queryForList("SELECT id,name,subject,status,created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5"),
            "recentChanges",db.queryForList("SELECT event,entity_type,created_at FROM audit_logs WHERE event NOT LIKE 'LOGIN%' ORDER BY created_at DESC LIMIT 5"));
    }
}
