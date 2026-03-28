-- panel_photos テーブルに like_count カラムを追加
ALTER TABLE panel_photos ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;

-- 写真の like_count を更新するポリシー（既にあるUPDATEポリシーがあれば不要）
CREATE POLICY "Anyone can update photo likes"
  ON panel_photos FOR UPDATE
  USING (true)
  WITH CHECK (true);
