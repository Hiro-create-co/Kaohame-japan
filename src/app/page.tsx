"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getPanels, getBestPhotos } from "@/lib/panels";
import type { Panel } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function HomePage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { latitude, longitude } = useGeolocation();
  const router = useRouter();

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

  return (
    <div className="relative flex flex-1 flex-col" style={{ minHeight: "calc(100dvh - 4rem)" }}>
      {/* Header - overlay on map */}
      <header className="absolute left-0 right-0 top-0 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 shadow-sm">
        <h1 className="text-center text-base font-bold text-rose-600">
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
              <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
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
                className="mt-3 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white"
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
            onPanelClick={(panel) => router.push(`/panels/${panel.id}`)}
            center={
              latitude && longitude
                ? [latitude, longitude]
                : [36.5, 137.0]
            }
            zoom={latitude ? 10 : 5}
          />
        )}
      </div>

      {/* Panel count badge */}
      <div className="absolute left-3 top-14 z-[1000] rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gray-700 shadow-md">
        {panels.length} 件のパネル
      </div>
    </div>
  );
}
