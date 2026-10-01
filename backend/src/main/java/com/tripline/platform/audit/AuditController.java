package com.tripline.platform.audit;

import com.tripline.platform.shared.Lists;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/audit")
class AuditController {
    private final JdbcTemplate db;
    AuditController(JdbcTemplate db) { this.db=db; }
    @GetMapping Object list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,@RequestParam(defaultValue="") String search) {
        String q="%"+search+"%";
        return Lists.page(db.queryForList("SELECT * FROM audit_logs WHERE event ILIKE ? OR actor ILIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?",q,q,Lists.size(size),Lists.offset(page,size)),db.queryForObject("SELECT count(*) FROM audit_logs WHERE event ILIKE ? OR actor ILIKE ?",Long.class,q,q),page,size);
    }
}
