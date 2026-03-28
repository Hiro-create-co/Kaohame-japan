"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Panel } from "@/types";

function createPanelIcon(imageUrl?: string | null) {
  if (imageUrl) {
    return L.divIcon({
      html: `<div style="width:40px;height:40px;border-radius:50%;border:3px solid #E11D48;box-shadow:0 2px 8px rgba(0,0,0,0.3);overflow:hidden;background:white;"><img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" /></div>`,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });
  }
  return L.divIcon({
    html: `<div style="width:40px;height:40px;border-radius:50%;border:3px solid #E11D48;box-shadow:0 2px 8px rgba(0,0,0,0.3);overflow:hidden;background:white;"><img src="/default-panel.jpg" style="width:100%;height:100%;object-fit:cover;" /></div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

const userIcon = L.divIcon({
  html: `<div style="background:#3B82F6;border-radius:50%;width:16px;height:16px;border:3px solid white;box-shadow:0 0 0 2px rgba(59,130,246,0.3),0 2px 6px rgba(0,0,0,0.3);"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapViewProps {
  panels: Panel[];
  userLat?: number | null;
  userLng?: number | null;
  onPanelClick?: (panel: Panel) => void;
  center?: [number, number];
  zoom?: number;
  mini?: boolean;
}

export default function MapView({
  panels,
  userLat,
  userLng,
  onPanelClick,
  center,
  zoom = 5,
  mini = false,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const defaultCenter: [number, number] = center || [36.5, 137.0];
    const map = L.map(containerRef.current, {
      zoomControl: false,
    }).setView(defaultCenter, zoom);

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when panels change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: L.Marker[] = [];

    panels.forEach((panel) => {
      const popupContent = onPanelClick
        ? `<div style="text-align:center;min-width:140px;padding:2px 0;">
            <strong style="font-size:14px;display:block;margin-bottom:4px;">${panel.name}</strong>
            <span style="color:#E11D48;font-size:12px;font-weight:500;">${panel.prefecture}</span>
            ${panel.description ? `<p style="color:#666;font-size:11px;margin-top:4px;line-height:1.4;">${panel.description.slice(0, 40)}${panel.description.length > 40 ? "..." : ""}</p>` : ""}
            <div style="margin-top:8px;"><a href="/panels/${panel.id}" style="display:inline-block;background:#E11D48;color:white;padding:4px 14px;border-radius:20px;font-size:12px;text-decoration:none;font-weight:bold;">詳細を見る</a></div>
          </div>`
        : `<div style="text-align:center;min-width:120px;">
            <strong style="font-size:14px;">${panel.name}</strong>
            <br/><span style="color:#666;font-size:12px;">${panel.prefecture}</span>
          </div>`;

      const marker = L.marker([panel.latitude, panel.longitude], {
        icon: createPanelIcon(panel.image_url),
      })
        .addTo(map)
        .bindPopup(popupContent);

      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [panels, onPanelClick]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLat || !userLng) return;

    const marker = L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<div style="text-align:center;font-size:12px;font-weight:500;">📍 現在地</div>');

    return () => {
      marker.remove();
    };
  }, [userLat, userLng]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ minHeight: mini ? "160px" : "300px" }}
    />
  );
}
