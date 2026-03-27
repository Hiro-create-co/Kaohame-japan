-- カオハメJAPAN Supabase Schema
-- Run this in the Supabase SQL Editor

-- Panels table: stores all kaohame panel locations
CREATE TABLE panels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  prefecture TEXT NOT NULL,
  image_url TEXT,
  contributor_name TEXT DEFAULT '匿名',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read panels (public wiki-style)
CREATE POLICY "Anyone can view panels"
  ON panels FOR SELECT
  USING (true);

-- Allow anyone to insert panels (no auth required for Phase 1)
CREATE POLICY "Anyone can add panels"
  ON panels FOR INSERT
  WITH CHECK (true);

-- Index for faster prefecture queries
CREATE INDEX idx_panels_prefecture ON panels (prefecture);

-- Index for geospatial-like queries (sorting by location)
CREATE INDEX idx_panels_location ON panels (latitude, longitude);

-- Insert some sample data for testing
INSERT INTO panels (name, description, latitude, longitude, prefecture, contributor_name) VALUES
  ('熊本城くまモンパネル', '熊本城の入口にあるくまモンの顔ハメパネル。大人気スポット！', 32.8063, 130.7058, '熊本県', 'ゆきこ'),
  ('道頓堀グリコパネル', '道頓堀のグリコ看板前にある顔ハメパネル', 34.6687, 135.5013, '大阪府', 'まりこ'),
  ('浅草雷門パネル', '雷門の横にある記念撮影用顔ハメパネル', 35.7116, 139.7966, '東京都', 'あいこ'),
  ('鳥取砂丘ラクダパネル', '砂丘入口のラクダに乗れる顔ハメパネル', 35.5404, 134.2286, '鳥取県', '匿名'),
  ('沖縄美ら海シーサーパネル', '美ら海水族館のシーサー顔ハメパネル', 26.6942, 127.8778, '沖縄県', 'さちこ'),
  ('札幌時計台パネル', '札幌時計台前の記念撮影パネル', 43.0625, 141.3544, '北海道', 'ともみ'),
  ('金閣寺パネル', '金閣寺の参道にある顔ハメパネル', 35.0394, 135.7292, '京都府', 'なつみ'),
  ('宮島鹿パネル', '厳島神社参道の鹿の顔ハメパネル', 34.2960, 132.3196, '広島県', 'あやか');
