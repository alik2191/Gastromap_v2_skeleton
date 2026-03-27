-- Migration: Add AI Data Layer fields to locations table
-- Date: 2026-03-27
-- Description: Extended schema for AI-powered recommendation matching

-- Contact & Links
ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS website           TEXT,
    ADD COLUMN IF NOT EXISTS booking_url       TEXT,
    ADD COLUMN IF NOT EXISTS social_links      JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS menu_url          TEXT,
    ADD COLUMN IF NOT EXISTS menu_format       TEXT DEFAULT 'file',
    ADD COLUMN IF NOT EXISTS phone             TEXT;

-- Occasion & Time Matching
ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS occasions         TEXT[]  DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS meal_times        TEXT[]  DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS neighbourhood     TEXT;

-- Atmosphere Deep Data
ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS ambiance          TEXT[]  DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS noise_level       TEXT    DEFAULT 'moderate'
                                                       CHECK (noise_level IN ('quiet','moderate','loud','very_loud')),
    ADD COLUMN IF NOT EXISTS avg_visit_duration TEXT   DEFAULT '1-2h',
    ADD COLUMN IF NOT EXISTS dress_code        TEXT    DEFAULT 'casual';

-- Practical Info
ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS reservation_policy TEXT   DEFAULT 'not_required'
                                                       CHECK (reservation_policy IN ('required','recommended','not_required','walk_in_only')),
    ADD COLUMN IF NOT EXISTS price_per_person   TEXT,
    ADD COLUMN IF NOT EXISTS parking_options    TEXT[]  DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS accessibility      TEXT[]  DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS languages          TEXT[]  DEFAULT '{}';

-- AI Quality Signals
ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS instagram_score    SMALLINT CHECK (instagram_score BETWEEN 1 AND 5),
    ADD COLUMN IF NOT EXISTS hidden_gem         BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS authenticity_score SMALLINT CHECK (authenticity_score BETWEEN 1 AND 5),
    ADD COLUMN IF NOT EXISTS popularity_score   SMALLINT CHECK (popularity_score BETWEEN 1 AND 5);

-- Menu & AI Data
ALTER TABLE locations
    ADD COLUMN IF NOT EXISTS dish_menu          JSONB   DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS ai_summary         TEXT;

-- Full-text search: extend existing FTS to include new text fields
-- (Only if the fts column exists — adjust to match your schema)
-- UPDATE locations SET fts = to_tsvector('english',
--     coalesce(title,'') || ' ' ||
--     coalesce(description,'') || ' ' ||
--     coalesce(ai_summary,'') || ' ' ||
--     coalesce(ai_context,'') || ' ' ||
--     coalesce(insider_tip,'') || ' ' ||
--     coalesce(neighbourhood,'')
-- );

-- Indexes for common AI filter queries
CREATE INDEX IF NOT EXISTS idx_locations_occasions     ON locations USING GIN (occasions);
CREATE INDEX IF NOT EXISTS idx_locations_meal_times    ON locations USING GIN (meal_times);
CREATE INDEX IF NOT EXISTS idx_locations_ambiance      ON locations USING GIN (ambiance);
CREATE INDEX IF NOT EXISTS idx_locations_hidden_gem    ON locations (hidden_gem) WHERE hidden_gem = TRUE;
CREATE INDEX IF NOT EXISTS idx_locations_noise_level   ON locations (noise_level);

COMMENT ON COLUMN locations.occasions IS 'Suitable occasions: date, solo, friends, family, business, celebration, anniversary, proposal, group';
COMMENT ON COLUMN locations.meal_times IS 'Meal periods: breakfast, brunch, lunch, dinner, late_night, all_day';
COMMENT ON COLUMN locations.ambiance IS 'Ambiance tags: cozy, romantic, industrial, rustic, modern, minimalist, lively, intimate, historic, sophisticated';
COMMENT ON COLUMN locations.noise_level IS 'Noise level: quiet (business/intimate), moderate, loud, very_loud';
COMMENT ON COLUMN locations.dish_menu IS 'Array of {name, category, price, description, dietary[]} menu items for AI dish search';
COMMENT ON COLUMN locations.ai_summary IS 'Rich AI-generated summary for semantic search and recommendations';

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS policy fix (idempotent — safe to run even if 001_locations.sql already
-- applied the correct policies; drop-then-create ensures we land in the right state)
-- ─────────────────────────────────────────────────────────────────────────────

-- Drop old restrictive write policy
drop policy if exists "Service role full access" on public.locations;

-- Public: read active locations only (keep this)
drop policy if exists "Public read active locations" on public.locations;
create policy "Public read active locations"
    on public.locations for select
    using (status = 'active');

-- Authenticated users: read ALL locations (needed for admin moderation)
drop policy if exists "Authenticated read all locations" on public.locations;
create policy "Authenticated read all locations"
    on public.locations for select
    to authenticated
    using (true);

-- Authenticated users: insert new locations (admin + user submissions)
drop policy if exists "Authenticated insert locations" on public.locations;
create policy "Authenticated insert locations"
    on public.locations for insert
    to authenticated
    with check (true);

-- Authenticated users: update locations (admin moderation, editing)
drop policy if exists "Authenticated update locations" on public.locations;
create policy "Authenticated update locations"
    on public.locations for update
    to authenticated
    using (true)
    with check (true);

-- Authenticated users: delete locations (admin only)
drop policy if exists "Authenticated delete locations" on public.locations;
create policy "Authenticated delete locations"
    on public.locations for delete
    to authenticated
    using (true);
