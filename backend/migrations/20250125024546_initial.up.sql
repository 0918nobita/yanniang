-- Add up migration script here
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    handle TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    modified_at TIMESTAMPTZ,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS session (
    session_id UUID PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    FOREIGN KEY (user_id) REFERENCES "user" (id)
);

CREATE TABLE IF NOT EXISTS user_lang (
    user_id INTEGER NOT NULL,
    lang TEXT NOT NULL,
    proficiency INTEGER NOT NULL,
    UNIQUE (user_id, lang),
    FOREIGN KEY (user_id) REFERENCES "user" (id)
);

CREATE TABLE IF NOT EXISTS thread (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    title TEXT NOT NULL,
    lang TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    modified_at TIMESTAMPTZ,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (author_id) REFERENCES "user" (id)
);

CREATE TABLE IF NOT EXISTS summary (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL,
    thread_id INTEGER NOT NULL,
    is_private BOOLEAN NOT NULL,
    author_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    lang TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    modified_at TIMESTAMPTZ,
    UNIQUE (thread_id, is_private),
    FOREIGN KEY (thread_id) REFERENCES thread (id)
);
