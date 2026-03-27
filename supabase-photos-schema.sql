CREATE TABLE panel_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  panel_id UUID REFERENCES panels(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  user_name TEXT DEFAULT '匿名',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE panel_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos" ON panel_photos FOR SELECT USING (true);
CREATE POLICY "Anyone can add photos" ON panel_photos FOR INSERT WITH CHECK (true);

CREATE INDEX idx_photos_panel ON panel_photos (panel_id);
