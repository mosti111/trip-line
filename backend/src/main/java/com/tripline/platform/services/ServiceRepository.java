package com.tripline.platform.services;

import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

interface ServiceRepository extends JpaRepository<TravelService,UUID> {
    Optional<TravelService> findBySlugAndLocale(String slug,String locale);
    @Query(value="SELECT * FROM services WHERE NOT archived AND locale=:locale AND published_content IS NOT NULL AND published_content->>'enabled'='true' AND (:featured=false OR published_content->>'featured'='true') AND (:category='' OR published_content->>'category'=:category) ORDER BY (published_content->>'displayOrder')::int,slug",nativeQuery=true)
    List<TravelService> published(String locale,boolean featured,String category);
    @Query(value="SELECT * FROM services WHERE slug ILIKE concat('%',:search,'%') OR draft_content->>'title' ILIKE concat('%',:search,'%') ORDER BY updated_at DESC",countQuery="SELECT count(*) FROM services WHERE slug ILIKE concat('%',:search,'%') OR draft_content->>'title' ILIKE concat('%',:search,'%')",nativeQuery=true)
    Page<TravelService> search(String search,Pageable pageable);
}
