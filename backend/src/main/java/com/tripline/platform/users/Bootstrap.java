package com.tripline.platform.users;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
class Bootstrap implements ApplicationRunner {
    private final Users users; private final JdbcTemplate db; private final String email,password;
    Bootstrap(Users users,JdbcTemplate db,@Value("${tripline.bootstrap-email}") String email,@Value("${tripline.bootstrap-password}") String password) { this.users=users; this.db=db; this.email=email; this.password=password; }
    public void run(ApplicationArguments args) {
        if(db.queryForObject("SELECT count(*) FROM users",Long.class)==0 && !email.isBlank() && !password.isBlank())
            users.save(null,new Users.Input(email,"Administrator",password,"SUPER_ADMIN",false,0));
    }
}
