CREATE TABLE IF NOT EXISTS invitation_codes(
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_used INTEGER NOT NULL DEFAULT 0
);