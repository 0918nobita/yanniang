-- Add up migration script here
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    handle TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    modified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS learning_contents (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    front_lang INTEGER NOT NULL,
    back_lang INTEGER NOT NULL,
    author INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    modified_at TIMESTAMPTZ,
    CONSTRAINT fk_author FOREIGN KEY (author) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS content_relations (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL,
    relation_type INTEGER NOT NULL,
    related_content INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    modified_at TIMESTAMPTZ,
    CONSTRAINT fk_content FOREIGN KEY (content_id) REFERENCES learning_contents (id),
    CONSTRAINT fk_related_content FOREIGN KEY (related_content) REFERENCES learning_contents (id),
    CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES users (id)
);
