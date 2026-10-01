package com.tripline.platform.audit;

import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class Audit {
    private final JdbcTemplate db;
    public Audit(JdbcTemplate db) { this.db=db; }
    public void record(String event,String type,Object id) {
        var auth=SecurityContextHolder.getContext().getAuthentication();
        recordAs(auth==null?null:auth.getName(),event,type,id);
    }
    public void recordAs(String actor,String event,String type,Object id) {
        db.update("INSERT INTO audit_logs(id,actor,event,entity_type,entity_id) VALUES(?,?,?,?,?)",UUID.randomUUID(),actor,event,type,id==null?null:id.toString());
    }
}
