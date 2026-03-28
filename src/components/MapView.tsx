"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { Panel } from "@/types";

function createPanelIcon(imageUrl?: string | null, selected?: boolean) {
  const size = selected ? 52 : 40;
  const border = selected ? "4px solid #EAB308" : "3px solid #EAB308";
  const shadow = selected
    ? "0 0 0 4px rgba(234,179,8,0.3),0 4px 12px rgba(0,0,0,0.4)"
    : "0 2px 8px rgba(0,0,0,0.3)";
  const src = imageUrl || "/default-panel.jpg";
  return L.divIcon({
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;border:${border};box-shadow:${shadow};overflow:hidden;background:white;transition:all 0.2s;"><img src="${src}" style="width:100%;height:100%;object-fit:cover;" /></div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
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
  onPanelSelect?: (panel: Panel | null) => void;
  selectedPanelId?: string | null;
  center?: [number, number];
  zoom?: number;
  mini?: boolean;
  onMapReady?: (map: L.Map) => void;
}

export default function MapView({
  panels,
  userLat,
  userLng,
  onPanelSelect,
  selectedPanelId,
  center,
  zoom = 5,
  mini = false,
  onMapReady,
}: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);

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

    // Tap on empty map area deselects
    map.on("click", () => {
      if (onPanelSelect) onPanelSelect(null);
    });

    mapRef.current = map;
    if (onMapReady) onMapReady(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers with clustering when panels change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mini) return;

    // Remove old cluster group
    if (clusterRef.current) {
      map.removeLayer(clusterRef.current);
    }

    const cluster = (L as unknown as { markerClusterGroup: (opts?: object) => L.MarkerClusterGroup }).markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (c: L.MarkerCluster) => {
        const count = c.getChildCount();
        let size = 40;
        let fontSize = 14;
        if (count >= 50) { size = 56; fontSize = 16; }
        else if (count >= 20) { size = 48; fontSize = 15; }
        return L.divIcon({
          html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,#EAB308,#CA8A04);color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${fontSize}px;box-shadow:0 2px 8px rgba(234,179,8,0.4);border:3px solid white;">${count}</div>`,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });
      },
    });

    panels.forEach((panel) => {
      const isSelected = panel.id === selectedPanelId;
      const marker = L.marker([panel.latitude, panel.longitude], {
        icon: createPanelIcon(panel.image_url, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        if (onPanelSelect) onPanelSelect(panel);
      });

      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    clusterRef.current = cluster;

    return () => {
      if (map.hasLayer(cluster)) {
        map.removeLayer(cluster);
      }
    };
  }, [panels, selectedPanelId, onPanelSelect, mini]);

  // Mini mode: simple markers without clustering
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mini) return;

    const markers: L.Marker[] = [];
    panels.forEach((panel) => {
      const marker = L.marker([panel.latitude, panel.longitude], {
        icon: createPanelIcon(panel.image_url),
      }).addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [panels, mini]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLat || !userLng) return;

    const marker = L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup(
        '<div style="text-align:center;font-size:12px;font-weight:500;">📍 現在地</div>'
      );

    return () => {
      marker.remove();
    };
  }, [userLat, userLng]);

  // Pan to selected panel
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPanelId) return;
    const panel = panels.find((p) => p.id === selectedPanelId);
    if (panel) {
      map.setView([panel.latitude, panel.longitude], Math.max(map.getZoom(), 12), { animate: true });
    }
  }, [selectedPanelId, panels]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ minHeight: mini ? "160px" : "300px" }}
    />
  );
}
