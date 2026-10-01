package com.tripline.platform.users;

import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
class UsersController {
    private final Users users;
    UsersController(Users users) { this.users=users; }
    @GetMapping Object list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size,@RequestParam(defaultValue="") String search) { return users.list(page,size,search); }
    @PostMapping Object create(@Valid @RequestBody Users.Input input) { return users.save(null,input); }
    @PatchMapping("/{id}") Object update(@PathVariable UUID id,@Valid @RequestBody Users.Input input) { return users.save(id,input); }
}
