export interface Panel {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  prefecture: string;
  image_url: string | null;
  contributor_name: string;
  like_count: number;
  created_at: string;
}

export interface PanelPhoto {
  id: string;
  panel_id: string;
  image_url: string;
  user_name: string;
  like_count: number;
  created_at: string;
}

export type Prefecture = {
  name: string;
  region: string;
  panelCount: number;
  visited: boolean;
};
