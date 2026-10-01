CREATE TABLE users (
 id uuid PRIMARY KEY, email varchar(254) NOT NULL UNIQUE, display_name varchar(100) NOT NULL,
 password_hash varchar(200) NOT NULL, disabled boolean NOT NULL DEFAULT false,
 version bigint NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE roles (name varchar(30) PRIMARY KEY CHECK(name IN ('SUPER_ADMIN','ADMIN','EDITOR')));
INSERT INTO roles VALUES ('SUPER_ADMIN'),('ADMIN'),('EDITOR');
CREATE TABLE user_roles (user_id uuid REFERENCES users(id), role_name varchar(30) REFERENCES roles(name), PRIMARY KEY(user_id,role_name));
CREATE TABLE spring_session (
 PRIMARY_ID char(36) NOT NULL PRIMARY KEY, SESSION_ID char(36) NOT NULL UNIQUE,
 CREATION_TIME bigint NOT NULL, LAST_ACCESS_TIME bigint NOT NULL, MAX_INACTIVE_INTERVAL integer NOT NULL,
 EXPIRY_TIME bigint NOT NULL, PRINCIPAL_NAME varchar(100)
);
CREATE INDEX spring_session_expiry ON spring_session(EXPIRY_TIME);
CREATE INDEX spring_session_principal ON spring_session(PRINCIPAL_NAME);
CREATE TABLE spring_session_attributes (
 SESSION_PRIMARY_ID char(36) NOT NULL REFERENCES spring_session(PRIMARY_ID) ON DELETE CASCADE,
 ATTRIBUTE_NAME varchar(200) NOT NULL, ATTRIBUTE_BYTES bytea NOT NULL,
 PRIMARY KEY(SESSION_PRIMARY_ID,ATTRIBUTE_NAME)
);
