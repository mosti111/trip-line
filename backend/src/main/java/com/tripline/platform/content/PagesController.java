package com.tripline.platform.content;

import com.tripline.platform.shared.Document;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import org.springframework.web.bind.annotation.*;

@RestController
class PagesController {
    private final Pages pages;
    PagesController(Pages pages) { this.pages=pages; }
    record Update(long version,@NotNull @Valid Document content) {}
    record Publish(long version) {}
    @GetMapping("/api/v1/public/pages/{slug}") Object published(@PathVariable String slug,@RequestParam(defaultValue="en") String locale) { return pages.publicPage(slug,locale); }
    @GetMapping("/api/v1/admin/pages") Object list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size) { return pages.list(page,size); }
    @GetMapping({"/api/v1/admin/pages/{id}","/api/v1/admin/pages/{id}/preview"}) Object draft(@PathVariable UUID id) { return pages.draft(id); }
    @PatchMapping("/api/v1/admin/pages/{id}") Object save(@PathVariable UUID id,@Valid @RequestBody Update input) { return pages.save(id,input.version(),input.content()); }
    @PostMapping("/api/v1/admin/pages/{id}/publish") Object publish(@PathVariable UUID id,@RequestBody Publish input) { return pages.publish(id,input.version()); }
}
