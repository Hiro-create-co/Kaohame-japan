"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPanels, getDistanceKm } from "@/lib/panels";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PREFECTURES } from "@/data/prefectures";
import type { Panel } from "@/types";

type TabMode = "list" | "ranking";

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-lg">🥇</span>;
  if (rank === 2) return <span className="text-lg">🥈</span>;
  if (rank === 3) return <span className="text-lg">🥉</span>;
  return <span className="w-7 text-center text-sm font-bold text-gray-400">{rank}</span>;
}

export default function ListPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"new" | "near" | "prefecture">("new");
  const [tab, setTab] = useState<TabMode>("list");
  const [rankingType, setRankingType] = useState<"likes" | "prefecture" | "new">("likes");
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

  // Ranking data
  const likeRanking = [...panels]
    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
    .slice(0, 20);

  const prefectureRanking = (() => {
    const counts: Record<string, number> = {};
    panels.forEach((p) => {
      counts[p.prefecture] = (counts[p.prefecture] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([name, count]) => ({ name, count }));
  })();

  const newPanels = [...panels]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 20);

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        {/* Tab switch */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setTab("list")}
            className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
              tab === "list"
                ? "text-yellow-500 border-b-2 border-yellow-500"
                : "text-gray-400"
            }`}
          >
            パネル一覧
          </button>
          <button
            onClick={() => setTab("ranking")}
            className={`flex-1 py-3 text-center text-sm font-bold transition-colors ${
              tab === "ranking"
                ? "text-yellow-500 border-b-2 border-yellow-500"
                : "text-gray-400"
            }`}
          >
            ランキング
          </button>
        </div>

        {/* List tab header */}
        {tab === "list" && (
          <div className="px-4 py-3">
            <div>
              <input
                type="text"
                placeholder="パネル名・都道府県で検索..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>
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
          </div>
        )}

        {/* Ranking tab header */}
        {tab === "ranking" && (
          <div className="px-4 py-3">
            <div className="flex gap-2">
              {[
                { key: "likes" as const, label: "❤️ いいね" },
                { key: "prefecture" as const, label: "🗾 都道府県別" },
                { key: "new" as const, label: "🆕 新着" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setRankingType(s.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    rankingType === s.key
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-500" />
          </div>
        ) : tab === "list" ? (
          /* ===== LIST VIEW ===== */
          filteredPanels.length === 0 ? (
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
          )
        ) : (
          /* ===== RANKING VIEW ===== */
          <div className="space-y-3">
            {rankingType === "likes" && (
              <>
                <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 text-white text-center mb-4">
                  <p className="text-sm font-medium opacity-90">いいねランキング</p>
                  <p className="text-xs opacity-70 mt-0.5">みんなが気に入ったパネルTOP20</p>
                </div>
                {likeRanking.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">
                    まだいいねがありません
                  </p>
                ) : (
                  likeRanking.map((panel, i) => (
                    <Link
                      key={panel.id}
                      href={`/panels/${panel.id}`}
                      className={`flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
                        i < 3 ? "ring-1 ring-yellow-200" : ""
                      }`}
                    >
                      <RankMedal rank={i + 1} />
                      <img
                        src={panel.image_url || "/default-panel.jpg"}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                          {panel.name}
                        </h3>
                        <p className="text-[11px] text-yellow-500 font-medium">
                          {panel.prefecture}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span className="text-sm font-bold text-gray-700">
                          {panel.like_count || 0}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </>
            )}

            {rankingType === "prefecture" && (
              <>
                <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 text-white text-center mb-4">
                  <p className="text-sm font-medium opacity-90">都道府県別パネル数</p>
                  <p className="text-xs opacity-70 mt-0.5">パネルが多い都道府県は？</p>
                </div>
                {prefectureRanking.map(({ name, count }, i) => (
                  <div
                    key={name}
                    className={`flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ${
                      i < 3 ? "ring-1 ring-yellow-200" : ""
                    }`}
                  >
                    <RankMedal rank={i + 1} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                          style={{
                            width: `${(count / (prefectureRanking[0]?.count || 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 shrink-0">
                      {count}件
                    </span>
                  </div>
                ))}
              </>
            )}

            {rankingType === "new" && (
              <>
                <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-4 text-white text-center mb-4">
                  <p className="text-sm font-medium opacity-90">新着パネル</p>
                  <p className="text-xs opacity-70 mt-0.5">最近登録されたパネル</p>
                </div>
                {newPanels.map((panel, i) => (
                  <Link
                    key={panel.id}
                    href={`/panels/${panel.id}`}
                    className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span className="w-7 text-center text-sm font-bold text-gray-400">
                      {i + 1}
                    </span>
                    <img
                      src={panel.image_url || "/default-panel.jpg"}
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {panel.name}
                      </h3>
                      <p className="text-[11px] text-yellow-500 font-medium">
                        {panel.prefecture}
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">
                      {new Date(panel.created_at).toLocaleDateString("ja-JP", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
