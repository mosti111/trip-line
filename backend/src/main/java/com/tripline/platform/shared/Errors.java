package com.tripline.platform.shared;

import java.time.Instant;
import java.util.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;

@RestControllerAdvice
class Errors {
    static Map<String,Object> body(String code,String message,Map<String,String> fields,String trace) {
        return Map.of("code",code,"message",message,"fieldErrors",fields,"timestamp",Instant.now().toString(),"traceId",trace==null?"":trace);
    }
    @ExceptionHandler(ApiException.class)
    ResponseEntity<?> domain(ApiException e,HttpServletRequest r) { return ResponseEntity.status(e.status).body(body(e.code,e.getMessage(),Map.of(),r.getHeader("X-Request-ID"))); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException e) {
        Map<String,String> fields=new LinkedHashMap<>(); e.getBindingResult().getFieldErrors().forEach(f->fields.put(f.getField(),f.getDefaultMessage()));
        return ResponseEntity.badRequest().body(body("VALIDATION","Please check the highlighted fields.",fields,""));
    }
    @ExceptionHandler({IllegalArgumentException.class, org.springframework.http.converter.HttpMessageNotReadableException.class})
    ResponseEntity<?> invalid(Exception e) { return ResponseEntity.badRequest().body(body("INVALID_REQUEST","Please check your input.",Map.of(),"")); }
    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<?> forbidden() { return ResponseEntity.status(403).body(body("FORBIDDEN","You do not have access to this action.",Map.of(),"")); }
    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    ResponseEntity<?> duplicate() { return ResponseEntity.status(409).body(body("CONFLICT","This value is already used or referenced.",Map.of(),"")); }
    @ExceptionHandler(Exception.class)
    ResponseEntity<?> unexpected(Exception e) {
        String trace=UUID.randomUUID().toString(); LoggerFactory.getLogger(Errors.class).error("Request failed trace={}",trace,e);
        return ResponseEntity.internalServerError().body(body("INTERNAL_ERROR","Something went wrong. Please try again.",Map.of(),trace));
    }
}
