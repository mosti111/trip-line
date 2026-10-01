package com.tripline.platform.auth;

import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.ApiException;
import com.tripline.platform.users.Users;
import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.Duration;
import java.util.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.*;
import org.springframework.security.core.context.*;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
class AuthController {
    private final AuthenticationManager manager; private final SecurityContextRepository repository; private final SessionAuthenticationStrategy strategy;
    private final Users users; private final Audit audit; private final RateLimits limits;
    AuthController(AuthenticationManager manager,SecurityContextRepository repository,SessionAuthenticationStrategy strategy,Users users,Audit audit,RateLimits limits) {
        this.manager=manager; this.repository=repository; this.strategy=strategy; this.users=users; this.audit=audit; this.limits=limits;
    }
    record Login(@NotBlank @Size(max=254) String email,@NotBlank @Size(max=128) String password) {}
    record Password(@NotBlank @Size(max=128) String current,@NotBlank @Size(min=12,max=128) String next) {}
    @GetMapping("/csrf") Object csrf(CsrfToken token) { return Map.of("token",token.getToken(),"headerName",token.getHeaderName()); }
    @PostMapping("/login") Object login(@Valid @RequestBody Login input,HttpServletRequest request,HttpServletResponse response) {
        String email=input.email().toLowerCase(Locale.ROOT).strip();
        limits.check("login-ip:"+request.getRemoteAddr(),30,Duration.ofMinutes(15));
        limits.check("login-user:"+email,10,Duration.ofMinutes(15));
        try {
            Authentication auth=manager.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(email,input.password()));
            strategy.onAuthentication(auth,request,response);
            SecurityContext context=SecurityContextHolder.createEmptyContext(); context.setAuthentication(auth);
            SecurityContextHolder.setContext(context); repository.saveContext(context,request,response);
            audit.recordAs(email,"LOGIN_SUCCESS","user",null); return users.me(email);
        } catch(AuthenticationException e) { audit.recordAs(null,"LOGIN_FAILURE","user",null); throw new ApiException(401,"INVALID_CREDENTIALS","Email or password is incorrect."); }
    }
    @GetMapping("/me") Object me(Authentication auth) { return users.me(auth.getName()); }
    @PostMapping("/change-password") void password(@Valid @RequestBody Password input,Authentication auth,HttpServletRequest request) {
        users.changePassword(auth.getName(),input.current(),input.next()); request.getSession().invalidate(); SecurityContextHolder.clearContext();
    }
}
