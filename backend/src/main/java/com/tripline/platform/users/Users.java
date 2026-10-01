package com.tripline.platform.users;

import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.*;
import java.util.*;
import jakarta.validation.constraints.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class Users implements UserDetailsService {
    private final JdbcTemplate db; private final PasswordEncoder encoder; private final Audit audit;
    public Users(JdbcTemplate db,PasswordEncoder encoder,Audit audit) { this.db=db; this.encoder=encoder; this.audit=audit; }
    public record Input(@NotBlank @Email @Size(max=254) String email,@NotBlank @Size(max=100) String displayName,@Size(max=128) String password,@NotBlank @Pattern(regexp="SUPER_ADMIN|ADMIN|EDITOR") String role,boolean disabled,long version) {}
    public UserDetails loadUserByUsername(String email) {
        var rows=db.queryForList("SELECT * FROM users WHERE email=?",email.toLowerCase(Locale.ROOT));
        if(rows.isEmpty()) throw new UsernameNotFoundException("Invalid credentials");
        var u=rows.getFirst();
        return User.withUsername((String)u.get("email")).password((String)u.get("password_hash")).disabled((Boolean)u.get("disabled"))
            .roles(db.queryForList("SELECT role_name FROM user_roles WHERE user_id=?",String.class,u.get("id")).toArray(String[]::new)).build();
    }
    public Map<String,Object> me(String email) {
        var rows=db.queryForList("SELECT id,email,display_name,disabled,version FROM users WHERE email=?",email);
        if(rows.isEmpty()) throw ApiException.missing();
        var u=rows.getFirst(); u.put("roles",db.queryForList("SELECT role_name FROM user_roles WHERE user_id=?",String.class,u.get("id"))); return u;
    }
    public Object list(int page,int size,String search) {
        String q="%"+search+"%";
        var rows=db.queryForList("SELECT id,email,display_name,disabled,version FROM users WHERE email ILIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?",q,Lists.size(size),Lists.offset(page,size));
        rows.forEach(u->u.put("role",db.queryForObject("SELECT role_name FROM user_roles WHERE user_id=?",String.class,u.get("id"))));
        return Lists.page(rows,db.queryForObject("SELECT count(*) FROM users WHERE email ILIKE ?",Long.class,q),page,size);
    }
    @Transactional
    public Object save(UUID id,Input input) {
        boolean create=id==null; if(create) id=UUID.randomUUID();
        String email=input.email().toLowerCase(Locale.ROOT).strip();
        // Serializes role mutations so concurrent demotions cannot remove the last super-admin.
        db.queryForList("SELECT name FROM roles WHERE name='SUPER_ADMIN' FOR UPDATE");
        if(create) {
            requirePassword(input.password());
            db.update("INSERT INTO users(id,email,display_name,password_hash) VALUES(?,?,?,?)",id,email,input.displayName(),encoder.encode(input.password()));
        } else {
            var old=db.queryForList("SELECT email FROM users WHERE id=?",id); if(old.isEmpty()) throw ApiException.missing();
            boolean wasSuper=db.queryForObject("SELECT count(*) FROM user_roles WHERE user_id=? AND role_name='SUPER_ADMIN'",Long.class,id)>0;
            long active=db.queryForObject("SELECT count(*) FROM users u JOIN user_roles r ON u.id=r.user_id WHERE NOT u.disabled AND r.role_name='SUPER_ADMIN'",Long.class);
            if(wasSuper && (input.disabled() || !input.role().equals("SUPER_ADMIN")) && active<=1) throw new ApiException(409,"LAST_ADMIN","Keep at least one active super administrator.");
            int updated=db.update("UPDATE users SET email=?,display_name=?,disabled=?,version=version+1 WHERE id=? AND version=?",email,input.displayName(),input.disabled(),id,input.version());
            if(updated==0) throw ApiException.conflict();
            if(input.password()!=null && !input.password().isBlank()) { requirePassword(input.password()); db.update("UPDATE users SET password_hash=? WHERE id=?",encoder.encode(input.password()),id); }
            db.update("DELETE FROM spring_session WHERE principal_name=?",old.getFirst().get("email"));
        }
        db.update("DELETE FROM user_roles WHERE user_id=?",id);
        db.update("INSERT INTO user_roles VALUES(?,?)",id,input.role());
        audit.record(create?"USER_CREATE":input.disabled()?"USER_DISABLE":"USER_UPDATE","user",id);
        return me(email);
    }
    @Transactional
    public void changePassword(String email,String current,String next) {
        var user=loadUserByUsername(email);
        if(!encoder.matches(current,user.getPassword())) throw new ApiException(400,"PASSWORD_MISMATCH","The current password is incorrect.");
        requirePassword(next);
        db.update("UPDATE users SET password_hash=?,version=version+1 WHERE email=?",encoder.encode(next),email);
        db.update("DELETE FROM spring_session WHERE principal_name=?",email);
        audit.record("USER_UPDATE","password",me(email).get("id"));
    }
    private void requirePassword(String password) { if(password==null || password.length()<12 || password.length()>128) throw new ApiException(400,"PASSWORD_LENGTH","Use a password between 12 and 128 characters."); }
}
