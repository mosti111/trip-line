package com.tripline.platform.services;

import com.tripline.platform.shared.Document;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
class ServicesController {
    private final Services services;
    ServicesController(Services services) { this.services=services; }
    record Update(@NotBlank @Size(max=100) String slug,long version,@NotNull @Valid Document content) {}
    record Version(long version) {}
    @GetMapping("/api/v1/public/services") Object published(@RequestParam(defaultValue="en") String locale,@RequestParam(defaultValue="false") boolean featured,@RequestParam(defaultValue="") String category) { return services.publicList(locale,featured,category); }
    @GetMapping("/api/v1/public/services/{slug}") Object one(@PathVariable String slug,@RequestParam(defaultValue="en") String locale) { return services.publicOne(slug,locale); }
    @GetMapping("/api/v1/admin/services") Object list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,@RequestParam(defaultValue="") String search) { return services.list(page,size,search); }
    @GetMapping({"/api/v1/admin/services/{id}","/api/v1/admin/services/{id}/preview"}) Object draft(@PathVariable UUID id) { return services.draft(id); }
    @PostMapping("/api/v1/admin/services") Object create(@Valid @RequestBody Update input) { return services.save(null,input.slug(),0,input.content()); }
    @PatchMapping("/api/v1/admin/services/{id}") Object save(@PathVariable UUID id,@Valid @RequestBody Update input) { return services.save(id,input.slug(),input.version(),input.content()); }
    @PostMapping("/api/v1/admin/services/{id}/publish") Object publish(@PathVariable UUID id,@RequestBody Version input) { return services.publish(id,input.version()); }
    @PostMapping("/api/v1/admin/services/{id}/archive") void archive(@PathVariable UUID id,@RequestBody Version input) { services.archive(id,input.version()); }
}
