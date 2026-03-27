import { supabase } from "./supabase";
import type { Panel } from "@/types";

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
  panel: Omit<Panel, "id" | "created_at">
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
