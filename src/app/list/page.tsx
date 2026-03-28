"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPanels, getDistanceKm } from "@/lib/panels";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PREFECTURES } from "@/data/prefectures";
import type { Panel } from "@/types";

export default function ListPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"new" | "near" | "prefecture">("new");
  const { latitude, longitude } = useGeolocation();

  useEffect(() => {
    getPanels().then((data) => {
      setPanels(data);
      setLoading(false);
    });
  }, []);

  const prefectureNames: string[] = PREFECTURES.map((p) => p.name);

  const filteredPanels = panels
    .filter(
      (p) =>
        !filter ||
        p.name.includes(filter) ||
        p.prefecture.includes(filter) ||
        p.description.includes(filter)
    )
    .sort((a, b) => {
      if (sortBy === "near" && latitude && longitude) {
        const distA = getDistanceKm(latitude, longitude, a.latitude, a.longitude);
        const distB = getDistanceKm(latitude, longitude, b.latitude, b.longitude);
        return distA - distB;
      }
      if (sortBy === "prefecture") {
        return (
          prefectureNames.indexOf(a.prefecture) -
          prefectureNames.indexOf(b.prefecture)
        );
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="bg-white px-4 py-3 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">パネル一覧</h1>

        {/* Search */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="パネル名・都道府県で検索..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        {/* Sort buttons */}
        <div className="mt-2 flex gap-2">
          {[
            { key: "new" as const, label: "新着順" },
            { key: "near" as const, label: "近い順" },
            { key: "prefecture" as const, label: "都道府県順" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sortBy === s.key
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-500" />
          </div>
        ) : filteredPanels.length === 0 ? (
          <div className="py-12 text-center">
            <img src="/default-panel.jpg" alt="" className="mx-auto h-16 w-16 rounded-lg" />
            <p className="mt-2 text-sm text-gray-500">
              {filter
                ? "該当するパネルが見つかりません"
                : "まだパネルが登録されていません"}
            </p>
            <Link
              href="/add"
              className="mt-3 inline-block rounded-full bg-yellow-500 px-4 py-2 text-sm font-medium text-white"
            >
              最初のパネルを登録する
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPanels.map((panel) => (
              <Link
                key={panel.id}
                href={`/panels/${panel.id}`}
                className="block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={panel.image_url || "/default-panel.jpg"}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {panel.name}
                    </h3>
                    <p className="text-xs text-yellow-500 font-medium">
                      {panel.prefecture}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {panel.description}
                    </p>
                    {(panel.like_count ?? 0) > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <svg
                          className="h-3.5 w-3.5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={0}
                          stroke="currentColor"
                        >
                          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span className="text-xs text-gray-400">
                          {panel.like_count}
                        </span>
                      </div>
                    )}
                  </div>
                  {latitude && longitude && (
                    <span className="shrink-0 text-xs text-gray-400">
                      {getDistanceKm(
                        latitude,
                        longitude,
                        panel.latitude,
                        panel.longitude
                      ).toFixed(1)}
                      km
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
