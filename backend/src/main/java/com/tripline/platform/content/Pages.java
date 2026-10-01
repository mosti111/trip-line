package com.tripline.platform.content;

import com.tripline.platform.audit.Audit;
import com.tripline.platform.shared.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;

@Service
public class Pages {
    private final PageRepository repository; private final Audit audit;
    public Pages(PageRepository repository,Audit audit) { this.repository=repository; this.audit=audit; }
    @Transactional(readOnly=true) public Object publicPage(String slug,String locale) {
        var page=repository.findBySlugAndLocale(slug,locale).orElseThrow(ApiException::missing);
        if(page.published==null || !page.published.enabled()) throw ApiException.missing(); return page.view(false);
    }
    @Transactional(readOnly=true) public Object list(int page,int size) { var result=repository.findAll(PageRequest.of(Math.max(0,page),Lists.size(size))); return Lists.page(result.getContent().stream().map(p->p.view(true)).toList(),result.getTotalElements(),page,size); }
    @Transactional(readOnly=true) public Object draft(UUID id) { return get(id).view(true); }
    @Transactional public Object save(UUID id,long version,Document document) { var p=get(id); p.check(version); p.save(document); repository.saveAndFlush(p); audit.record("PAGE_UPDATE","page",id); return p.view(true); }
    @Transactional public Object publish(UUID id,long version) { var p=get(id); p.check(version); p.publish(); repository.saveAndFlush(p); audit.record("PAGE_PUBLISH","page",id); return p.view(true); }
    @Transactional public void seed(String slug,Document document) { if(repository.findBySlugAndLocale(slug,"en").isEmpty()) { var p=new Page(); p.slug=slug; p.save(document); repository.save(p); } }
    private Page get(UUID id) { return repository.findById(id).orElseThrow(ApiException::missing); }
}
