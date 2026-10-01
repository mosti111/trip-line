package com.tripline.platform.shared;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;

public record Document(
    @NotBlank @Size(max=200) String title,
    @Size(max=500) String description,
    @Size(max=100) String eyebrow,
    @Size(max=1000) String image,
    @Size(max=300) String imageAlt,
    @Size(max=100) String category,
    boolean featured, boolean enabled, int displayOrder,
    @Size(max=100) String ctaLabel,
    @Size(max=1000) String ctaUrl,
    @Size(max=100) String seoTitle,
    @Size(max=300) String seoDescription,
    @Size(max=1000) String ogImage,
    @NotNull @Size(max=20) List<@Valid Section> sections
) {
    public record Section(
        @NotBlank @Pattern(regexp="[a-z][a-z0-9-]{0,49}") String key,
        @NotBlank @Pattern(regexp="philosophy|services|story|differentiators|metrics|cta|process|values|team|partners|overview|highlights|gallery|information|included|excluded|faq|related") String type,
        boolean enabled,
        @Size(max=100) String eyebrow,
        @Size(max=200) String title,
        @Size(max=12000) String body,
        @Size(max=1000) String image,
        @Size(max=300) String imageAlt,
        @Size(max=100) String ctaLabel,
        @Size(max=1000) String ctaUrl,
        @NotNull @Size(max=30) List<@Valid Item> items
    ) {}
    public record Item(@Size(max=200) String title,@Size(max=3000) String body,@Size(max=1000) String image,@Size(max=300) String imageAlt,@Size(max=1000) String url) {}
    public void validateLinks() {
        if(sections.stream().map(Section::key).distinct().count()!=sections.size()) throw new ApiException(400,"DUPLICATE_SECTION","Section keys must be unique.");
        link(ctaUrl); image(image); image(ogImage);
        for(var s:sections) { link(s.ctaUrl); image(s.image); for(var i:s.items) { link(i.url); image(i.image); } }
    }
    static void link(String value) {
        if(value==null || value.isBlank()) return;
        if(!(value.startsWith("/") && !value.startsWith("//") && !value.contains("\\")) && !value.matches("https://[^\\s]+"))
            throw new ApiException(400,"INVALID_URL","Links must be local paths or HTTPS URLs.");
    }
    static void image(String value) { link(value); }
}
