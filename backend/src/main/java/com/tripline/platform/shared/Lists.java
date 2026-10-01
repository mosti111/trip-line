package com.tripline.platform.shared;

import java.util.*;

public final class Lists {
    private Lists() {}
    public static int size(int size) { return Math.max(1,Math.min(size,100)); }
    public static int offset(int page,int size) { return Math.max(0,Math.min(page,100000))*size(size); }
    public static Map<String,Object> page(List<?> items,long total,int page,int size) { return Map.of("items",items,"total",total,"page",Math.max(0,page),"size",size(size)); }
}
