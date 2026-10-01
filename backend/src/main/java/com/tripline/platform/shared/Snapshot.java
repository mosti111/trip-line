package com.tripline.platform.shared;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@MappedSuperclass
public abstract class Snapshot {
    @Id public UUID id=UUID.randomUUID();
    @Column(nullable=false) public String slug;
    @Column(nullable=false) public String locale="en";
    @JdbcTypeCode(SqlTypes.JSON) @Column(name="draft_content",columnDefinition="jsonb") public Document draft;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name="published_content",columnDefinition="jsonb") public Document published;
    @Version public long version;
    @Column(name="published_at") public Instant publishedAt;
    @Column(name="updated_at") public Instant updatedAt=Instant.now();
    public void check(long expected) { if(version!=expected) throw ApiException.conflict(); }
    public void save(Document document) { document.validateLinks(); draft=document; updatedAt=Instant.now(); }
    public void publish() { draft.validateLinks(); published=draft; publishedAt=Instant.now(); updatedAt=Instant.now(); }
    public Object view(boolean preview) { return new View(id,slug,locale,version,preview?draft:published,publishedAt,updatedAt); }
    public record View(UUID id,String slug,String locale,long version,Document content,Instant publishedAt,Instant updatedAt) {}
}
