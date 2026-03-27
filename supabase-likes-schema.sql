ALTER TABLE panels ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

CREATE POLICY "Anyone can update likes" ON panels FOR UPDATE USING (true) WITH CHECK (true);
