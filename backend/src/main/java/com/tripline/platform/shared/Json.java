package com.tripline.platform.shared;

import tools.jackson.databind.json.JsonMapper;

public final class Json {
    private static final JsonMapper MAPPER=JsonMapper.builder().build();
    private Json() {}
    public static String write(Object value) { return MAPPER.writeValueAsString(value); }
    public static <T> T read(String value,Class<T> type) { return MAPPER.readValue(value,type); }
}
