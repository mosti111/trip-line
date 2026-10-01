package com.tripline.platform.contacts;

import com.tripline.platform.shared.*;
import java.net.URI;
import java.net.http.*;
import java.time.Duration;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
class Turnstile {
    private final String secret,hostname;
    private final HttpClient client=HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
    Turnstile(@Value("${tripline.turnstile-secret}") String secret,@Value("${tripline.turnstile-hostname}") String hostname) { this.secret=secret; this.hostname=hostname; }
    void verify(String token) {
        if(secret.isBlank()) throw new ApiException(503,"CONTACT_UNAVAILABLE","Contact submission is temporarily unavailable.");
        try {
            var request=HttpRequest.newBuilder(URI.create("https://challenges.cloudflare.com/turnstile/v0/siteverify")).timeout(Duration.ofSeconds(10)).header("Content-Type","application/json")
                .POST(HttpRequest.BodyPublishers.ofString(Json.write(Map.of("secret",secret,"response",token)))).build();
            var response=client.send(request,HttpResponse.BodyHandlers.ofString());
            var result=Json.read(response.body(),Map.class);
            if(response.statusCode()!=200 || !Boolean.TRUE.equals(result.get("success")) || !hostname.equals(result.get("hostname")) || !"contact".equals(result.get("action"))) throw new ApiException(400,"VERIFICATION_FAILED","Please complete the verification again.");
        } catch(ApiException e) { throw e; } catch(Exception e) { if(e instanceof InterruptedException) Thread.currentThread().interrupt(); throw new ApiException(503,"VERIFICATION_UNAVAILABLE","Verification is unavailable. Please try again."); }
    }
}
