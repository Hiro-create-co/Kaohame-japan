import { supabase } from "./supabase";
import type { Panel, PanelPhoto } from "@/types";

export async function getPanels(): Promise<Panel[]> {
  const { data, error } = await supabase
    .from("panels")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching panels:", error);
    return [];
  }
  return data || [];
}

export async function getPanelById(id: string): Promise<Panel | null> {
  const { data, error } = await supabase
    .from("panels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching panel:", error);
    return null;
  }
  return data;
}

export async function getPanelsByPrefecture(
  prefecture: string
): Promise<Panel[]> {
  const { data, error } = await supabase
    .from("panels")
    .select("*")
    .eq("prefecture", prefecture)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching panels:", error);
    return [];
  }
  return data || [];
}

export async function addPanel(
  panel: Omit<Panel, "id" | "created_at" | "like_count">
): Promise<Panel | null> {
  const { data, error } = await supabase
    .from("panels")
    .insert(panel)
    .select()
    .single();

  if (error) {
    console.error("Error adding panel:", error);
    return null;
  }
  return data;
}

// ---------- Photo functions ----------

export async function uploadPhoto(
  panelId: string,
  file: File,
  userName: string
): Promise<PanelPhoto | null> {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filePath = `${panelId}/${timestamp}-${random}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("panel-photos")
    .upload(filePath, file, { contentType: file.type });

  if (uploadError) {
    console.error("Error uploading photo:", uploadError);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("panel-photos").getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("panel_photos")
    .insert({
      panel_id: panelId,
      image_url: publicUrl,
      user_name: userName || "匿名",
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving photo record:", error);
    return null;
  }
  return data;
}

export async function getPhotosByPanel(
  panelId: string
): Promise<PanelPhoto[]> {
  const { data, error } = await supabase
    .from("panel_photos")
    .select("*")
    .eq("panel_id", panelId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
  return data || [];
}

// ---------- Like functions ----------

const LIKES_KEY = "kaohame_likes";

function getLikedPanelIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) || "[]");
  } catch {
    return [];
  }
}

function setLikedPanelIds(ids: string[]) {
  localStorage.setItem(LIKES_KEY, JSON.stringify(ids));
}

export function isPanelLiked(panelId: string): boolean {
  return getLikedPanelIds().includes(panelId);
}

export async function likePanel(panelId: string): Promise<number | null> {
  const { data, error } = await supabase.rpc("increment_like", {
    row_id: panelId,
  });

  // Fallback: if RPC doesn't exist, do a manual update
  if (error) {
    const { data: panel } = await supabase
      .from("panels")
      .select("like_count")
      .eq("id", panelId)
      .single();

    const newCount = (panel?.like_count || 0) + 1;
    const { error: updateError } = await supabase
      .from("panels")
      .update({ like_count: newCount })
      .eq("id", panelId);

    if (updateError) {
      console.error("Error liking panel:", updateError);
      return null;
    }

    const ids = getLikedPanelIds();
    ids.push(panelId);
    setLikedPanelIds(ids);
    return newCount;
  }

  const ids = getLikedPanelIds();
  ids.push(panelId);
  setLikedPanelIds(ids);
  return data;
}

export async function unlikePanel(panelId: string): Promise<number | null> {
  const { data: panel } = await supabase
    .from("panels")
    .select("like_count")
    .eq("id", panelId)
    .single();

  const newCount = Math.max((panel?.like_count || 0) - 1, 0);
  const { error } = await supabase
    .from("panels")
    .update({ like_count: newCount })
    .eq("id", panelId);

  if (error) {
    console.error("Error unliking panel:", error);
    return null;
  }

  const ids = getLikedPanelIds().filter((id) => id !== panelId);
  setLikedPanelIds(ids);
  return newCount;
}

// Calculate distance between two coordinates in km
export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
