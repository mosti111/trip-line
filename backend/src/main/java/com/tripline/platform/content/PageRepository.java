package com.tripline.platform.content;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

interface PageRepository extends JpaRepository<Page,UUID> {
    Optional<Page> findBySlugAndLocale(String slug,String locale);
}
