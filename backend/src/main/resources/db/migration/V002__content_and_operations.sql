CREATE TABLE media_assets (
 id uuid PRIMARY KEY, object_key varchar(200) NOT NULL UNIQUE, url text NOT NULL,
 filename varchar(255) NOT NULL, alt varchar(300) NOT NULL, mime_type varchar(100) NOT NULL,
 width integer NOT NULL CHECK(width>0), height integer NOT NULL CHECK(height>0), size_bytes bigint NOT NULL CHECK(size_bytes>0),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE pages (
 id uuid PRIMARY KEY, slug varchar(100) NOT NULL, locale varchar(12) NOT NULL DEFAULT 'en',
 draft_content jsonb NOT NULL, published_content jsonb, version bigint NOT NULL DEFAULT 0,
 published_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(slug,locale)
);
CREATE TABLE service_categories (id uuid PRIMARY KEY, name varchar(100) NOT NULL UNIQUE);
CREATE TABLE services (
 id uuid PRIMARY KEY, slug varchar(100) NOT NULL, locale varchar(12) NOT NULL DEFAULT 'en',
 draft_content jsonb NOT NULL, published_content jsonb, version bigint NOT NULL DEFAULT 0,
 published_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now(), archived boolean NOT NULL DEFAULT false,
 UNIQUE(slug,locale)
);
CREATE INDEX services_public ON services(locale,slug) WHERE published_content IS NOT NULL AND NOT archived;
CREATE TABLE site_settings (id integer PRIMARY KEY CHECK(id=1), content jsonb NOT NULL, version bigint NOT NULL DEFAULT 0);
INSERT INTO site_settings VALUES (1,'{"companyName":"Trip Line","tagline":"","email":"","phone":"","whatsapp":"","address":"","footerText":"","socials":[],"seoTitle":"Trip Line","seoDescription":"","timezone":"Europe/Istanbul","locale":"en"}',0);
CREATE TABLE contact_submissions (
 id uuid PRIMARY KEY, request_id uuid NOT NULL UNIQUE, name varchar(120) NOT NULL, email varchar(254) NOT NULL,
 phone varchar(40), company varchar(150), subject varchar(200), message text NOT NULL,
 service_interest varchar(100), source varchar(500), utm jsonb NOT NULL DEFAULT '{}',
 status varchar(20) NOT NULL DEFAULT 'NEW' CHECK(status IN ('NEW','READ','REPLIED','ARCHIVED')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contacts_status_time ON contact_submissions(status,created_at DESC);
CREATE INDEX media_created ON media_assets(created_at DESC);
CREATE TABLE audit_logs (
 id uuid PRIMARY KEY, actor varchar(254), event varchar(60) NOT NULL, entity_type varchar(60), entity_id varchar(100),
 metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_time ON audit_logs(created_at DESC);
CREATE INDEX audit_actor ON audit_logs(actor,created_at DESC);
