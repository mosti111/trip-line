package com.tripline.platform.services;

import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;

@Service
public class Services {
    private final ServiceRepository repository; private final Audit audit;
    public Services(ServiceRepository repository,Audit audit) { this.repository=repository; this.audit=audit; }
    @Transactional(readOnly=true) public Object publicList(String locale,boolean featured,String category) { return repository.published(locale,featured,category).stream().map(p->p.view(false)).toList(); }
    @Transactional(readOnly=true) public Object publicOne(String slug,String locale) { var p=repository.findBySlugAndLocale(slug,locale).orElseThrow(ApiException::missing); if(p.archived || p.published==null || !p.published.enabled()) throw ApiException.missing(); return p.view(false); }
    @Transactional(readOnly=true) public Object list(int page,int size,String search) { var result=repository.search(search,PageRequest.of(Math.max(0,page),Lists.size(size))); return Lists.page(result.getContent().stream().map(p->p.view(true)).toList(),result.getTotalElements(),page,size); }
    @Transactional(readOnly=true) public Object draft(UUID id) { return get(id).view(true); }
    @Transactional public Object save(UUID id,String slug,long version,Document document) {
        boolean create=id==null; var p=create?new TravelService():get(id); if(!create) p.check(version);
        if(!slug.matches("[a-z0-9]+(?:-[a-z0-9]+)*") || slug.length()>100) throw new ApiException(400,"INVALID_SLUG","Use lowercase letters, numbers and hyphens.");
        if(p.published!=null && !slug.equals(p.slug)) throw new ApiException(409,"PUBLISHED_SLUG","Published service URLs cannot be changed.");
        p.slug=slug; p.save(document); repository.saveAndFlush(p); audit.record(create?"SERVICE_CREATE":"SERVICE_UPDATE","service",p.id); return p.view(true);
    }
    @Transactional public Object publish(UUID id,long version) { var p=get(id); p.check(version); p.archived=false; p.publish(); repository.saveAndFlush(p); audit.record("SERVICE_PUBLISH","service",id); return p.view(true); }
    @Transactional public void archive(UUID id,long version) { var p=get(id); p.check(version); p.archived=true; repository.saveAndFlush(p); audit.record("SERVICE_ARCHIVE","service",id); }
    @Transactional public void seed(String slug,Document document) { if(repository.findBySlugAndLocale(slug,"en").isEmpty()) save(null,slug,0,document); }
    private TravelService get(UUID id) { return repository.findById(id).orElseThrow(ApiException::missing); }
}
