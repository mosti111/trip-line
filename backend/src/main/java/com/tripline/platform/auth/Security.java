package com.tripline.platform.auth;

import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.Json;
import com.tripline.platform.users.Users;
import java.util.*;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.*;
import org.springframework.security.web.csrf.*;
import org.springframework.security.web.authentication.session.*;

@Configuration
@EnableMethodSecurity
class Security {
    @Bean AuthenticationManager authenticationManager(Users users,PasswordEncoder encoder) {
        var provider=new DaoAuthenticationProvider(users); provider.setPasswordEncoder(encoder); return new ProviderManager(provider);
    }
    @Bean SecurityContextRepository contextRepository() { return new HttpSessionSecurityContextRepository(); }
    @Bean CsrfTokenRepository csrfRepository() { return new HttpSessionCsrfTokenRepository(); }
    @Bean SessionAuthenticationStrategy sessionStrategy(CsrfTokenRepository csrf) {
        return new CompositeSessionAuthenticationStrategy(List.of(new ChangeSessionIdAuthenticationStrategy(),new CsrfAuthenticationStrategy(csrf)));
    }
    @Bean SecurityFilterChain filter(HttpSecurity http,SecurityContextRepository repository,CsrfTokenRepository csrf,Audit audit) throws Exception {
        http.authorizeHttpRequests(a->a
            .requestMatchers("/actuator/health","/api/v1/auth/csrf","/api/v1/auth/login","/api/v1/public/**").permitAll()
            .requestMatchers("/api/v1/admin/users/**","/api/v1/admin/audit/**","/api/v1/admin/roles").hasRole("SUPER_ADMIN")
            .requestMatchers("/api/v1/admin/messages/**","/api/v1/admin/settings/**","/api/v1/admin/dashboard").hasAnyRole("ADMIN","SUPER_ADMIN")
            .requestMatchers("/api/v1/admin/**").hasAnyRole("EDITOR","ADMIN","SUPER_ADMIN")
            .requestMatchers("/api/v1/auth/**").authenticated().anyRequest().denyAll())
            .securityContext(c->c.securityContextRepository(repository))
            .csrf(c->c.csrfTokenRepository(csrf).csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
            .requestCache(c->c.disable())
            .exceptionHandling(e->e.authenticationEntryPoint((r,s,x)->error(s,401,"UNAUTHENTICATED","Please sign in."))
                .accessDeniedHandler((r,s,x)->error(s,403,"FORBIDDEN","Access denied or your security token expired.")))
            .logout(l->l.logoutUrl("/api/v1/auth/logout").addLogoutHandler((r,s,a)->{ if(a!=null)audit.recordAs(a.getName(),"LOGOUT","user",null); })
                .deleteCookies("TRIPLINE_SESSION").logoutSuccessHandler((r,s,a)->s.setStatus(204)))
            .headers(h->h.contentSecurityPolicy(c->c.policyDirectives("default-src 'none'; frame-ancestors 'none'")));
        return http.build();
    }
    private static void error(jakarta.servlet.http.HttpServletResponse response,int status,String code,String message) throws java.io.IOException {
        response.setStatus(status); response.setContentType("application/json");
        response.getWriter().write(Json.write(Map.of("code",code,"message",message,"fieldErrors",Map.of(),"timestamp",java.time.Instant.now().toString(),"traceId","")));
    }
}
