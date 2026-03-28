"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import L from "leaflet";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getPanels, getBestPhotos } from "@/lib/panels";
import type { Panel } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  if (km < 10) return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
}

export default function HomePage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
  const { latitude, longitude, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    Promise.all([getPanels(), getBestPhotos()])
      .then(([panelData, bestPhotos]) => {
        const enriched = panelData.map((p) => ({
          ...p,
          image_url: bestPhotos[p.id] || p.image_url,
        }));
        setPanels(enriched);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // Sort panels by distance from user
  const sortedPanels = latitude && longitude
    ? [...panels].sort((a, b) => {
        const distA = getDistance(latitude, longitude, a.latitude, a.longitude);
        const distB = getDistance(latitude, longitude, b.latitude, b.longitude);
        return distA - distB;
      })
    : panels;

  const handlePanelSelect = useCallback(
    (panel: Panel | null) => {
      setSelectedPanel(panel);
      // Scroll the card list to show the selected panel
      if (panel && cardScrollRef.current) {
        const idx = sortedPanels.findIndex((p) => p.id === panel.id);
        if (idx >= 0) {
          const cardWidth = 280 + 12; // card width + gap
          cardScrollRef.current.scrollTo({
            left: idx * cardWidth,
            behavior: "smooth",
          });
        }
      }
    },
    [sortedPanels]
  );

  // Go to current location
  const handleLocate = useCallback(() => {
    if (latitude && longitude && mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 12, { animate: true });
    } else {
      setLocating(true);
      requestLocation();
    }
  }, [latitude, longitude, requestLocation]);

  // When location arrives after button press
  useEffect(() => {
    if (locating && latitude && longitude && mapInstanceRef.current) {
      mapInstanceRef.current.setView([latitude, longitude], 12, { animate: true });
      setLocating(false);
    }
  }, [locating, latitude, longitude]);

  // Show alert when geolocation fails while locating
  useEffect(() => {
    if (locating && geoError) {
      setLocating(false);
      alert("📍 位置情報をオンにしてください\n\nスマホの「設定」→「プライバシー」→「位置情報サービス」をオンにして、ブラウザの位置情報も許可してください。");
    }
  }, [locating, geoError]);

  // Handle card scroll to update selected marker
  const handleCardScroll = useCallback(() => {
    if (!cardScrollRef.current) return;
    const scrollLeft = cardScrollRef.current.scrollLeft;
    const cardWidth = 280 + 12;
    const idx = Math.round(scrollLeft / cardWidth);
    if (idx >= 0 && idx < sortedPanels.length) {
      const panel = sortedPanels[idx];
      if (panel.id !== selectedPanel?.id) {
        setSelectedPanel(panel);
      }
    }
  }, [sortedPanels, selectedPanel]);

  return (
    <div
      className="relative flex flex-1 flex-col"
      style={{ minHeight: "calc(100dvh - 4rem)" }}
    >
      {/* Header - overlay on map */}
      <header className="absolute left-0 right-0 top-0 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 shadow-sm">
        <h1 className="text-center text-base font-bold text-pink-500">
          カオハメJAPAN
        </h1>
        <p className="text-center text-[10px] text-gray-500">
          全国の顔ハメパネルを制覇しよう！
        </p>
      </header>

      {/* Map - full height */}
      <div className="absolute inset-0">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
              <p className="text-sm text-gray-500">読み込み中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-4">
              <p className="text-4xl mb-2">😥</p>
              <p className="text-sm text-gray-500">
                データの読み込みに失敗しました
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white"
              >
                再読み込み
              </button>
            </div>
          </div>
        ) : (
          <MapView
            panels={panels}
            userLat={latitude}
            userLng={longitude}
            onPanelSelect={handlePanelSelect}
            selectedPanelId={selectedPanel?.id}
            center={[36.5, 137.0]}
            zoom={5}
            onMapReady={(map) => { mapInstanceRef.current = map; }}
          />
        )}
      </div>

      {/* Panel count badge */}
      <div className="absolute left-3 top-14 z-[1000] rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md">
        {panels.length} 件のパネル
      </div>

      {/* Locate me button */}
      <button
        onClick={handleLocate}
        className="absolute left-3 top-22 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md active:scale-95 transition-transform"
        aria-label="現在地に移動"
      >
        {locating ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-200 border-t-pink-500" />
        ) : (
          <svg className="h-5 w-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
          </svg>
        )}
      </button>

      {/* Bottom card carousel - Ezloo style */}
      {!loading && !error && panels.length > 0 && (
        <div className="absolute bottom-2 left-0 right-0 z-[1000]">
          <div
            ref={cardScrollRef}
            className="flex gap-3 overflow-x-auto px-3 pb-2 scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            onScroll={handleCardScroll}
          >
            {sortedPanels.map((panel) => {
              const dist =
                latitude && longitude
                  ? getDistance(
                      latitude,
                      longitude,
                      panel.latitude,
                      panel.longitude
                    )
                  : null;
              const isSelected = panel.id === selectedPanel?.id;

              return (
                <Link
                  key={panel.id}
                  href={`/panels/${panel.id}`}
                  className={`flex-shrink-0 rounded-2xl bg-white shadow-lg transition-all duration-200 ${
                    isSelected
                      ? "ring-2 ring-pink-400 shadow-xl scale-[1.02]"
                      : "shadow-md"
                  }`}
                  style={{
                    width: 280,
                    scrollSnapAlign: "center",
                  }}
                >
                  <div className="flex items-center gap-3 p-3">
                    {/* Panel image */}
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={panel.image_url || "/default-panel.jpg"}
                        alt={panel.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {/* Panel info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-gray-900">
                        {panel.name}
                      </h3>
                      <p className="text-xs font-medium text-pink-500">
                        {panel.prefecture}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-gray-500">
                        {panel.description?.slice(0, 30)}
                        {(panel.description?.length ?? 0) > 30 ? "..." : ""}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {dist !== null && (
                          <span className="text-[10px] text-gray-400">
                            📍 {formatDistance(dist)}
                          </span>
                        )}
                        {panel.like_count > 0 && (
                          <span className="text-[10px] text-gray-400">
                            ❤️ {panel.like_count}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="flex-shrink-0 text-gray-300">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
