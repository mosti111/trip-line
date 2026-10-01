package com.tripline.platform.auth;

import com.tripline.platform.shared.ApiException;
import java.time.*;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class RateLimits {
    private record Counter(long until,int count) {}
    private final Map<String,Counter> counters=new HashMap<>();
    public synchronized void check(String key,int limit,Duration window) {
        long now=System.currentTimeMillis();
        if(counters.size()>10000) counters.entrySet().removeIf(e->e.getValue().until()<now);
        Counter c=counters.get(key);
        if(c==null || c.until()<now) c=new Counter(now+window.toMillis(),0);
        if(c.count()>=limit || counters.size()>20000) throw new ApiException(429,"RATE_LIMIT","Too many attempts. Please try again later.");
        counters.put(key,new Counter(c.until(),c.count()+1));
    }
}
