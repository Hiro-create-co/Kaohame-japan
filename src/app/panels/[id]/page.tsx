"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getPanelById } from "@/lib/panels";
import type { Panel } from "@/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PanelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      getPanelById(params.id as string).then((data) => {
        setPanel(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  const handleShare = async () => {
    if (!panel) return;
    const text = `${panel.name}（${panel.prefecture}）の顔ハメパネルを見つけたよ！ #カオハメJAPAN`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: panel.name, text, url });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert("リンクをコピーしました！");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
      </div>
    );
  }

  if (!panel) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <p className="text-4xl">😢</p>
        <p className="mt-2 text-sm text-gray-500">
          パネルが見つかりませんでした
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white"
        >
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* Back button */}
      <header className="flex items-center gap-2 bg-white px-4 py-3 shadow-sm">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="flex-1 text-lg font-bold text-gray-900 truncate">
          {panel.name}
        </h1>
        <button
          onClick={handleShare}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          title="シェア"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Mini Map */}
        <div className="h-48">
          <MapView
            panels={[panel]}
            center={[panel.latitude, panel.longitude]}
            zoom={15}
          />
        </div>

        {/* Panel Info */}
        <div className="p-4 space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-3xl">
                🎭
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {panel.name}
                </h2>
                <p className="text-sm font-medium text-rose-600">
                  {panel.prefecture}
                </p>
              </div>
            </div>

            {panel.description && (
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {panel.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-1">
                登録者: {panel.contributor_name}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1">
                {new Date(panel.created_at).toLocaleDateString("ja-JP")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://www.google.com/maps?q=${panel.latitude},${panel.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              Google Maps
            </a>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              シェア
            </button>
          </div>

          {/* Coordinates */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-2">位置情報</h3>
            <p className="text-sm text-gray-600">
              緯度: {panel.latitude.toFixed(6)}
              <br />
              経度: {panel.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
