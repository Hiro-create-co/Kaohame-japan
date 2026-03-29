"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getPanels } from "@/lib/panels";
import { PREFECTURES, REGIONS } from "@/data/prefectures";
import { prefecturePaths } from "@/data/prefecturePaths";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import type { Panel } from "@/types";

const VISITED_PANELS_KEY = "kaohame_visited_panels";

function getVisitedPanelIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(VISITED_PANELS_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

function saveVisitedPanelIds(ids: Set<string>) {
  localStorage.setItem(VISITED_PANELS_KEY, JSON.stringify([...ids]));
}

// Confetti component
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#EAB308", "#FACC15", "#FDE047", "#FEF08A", "#F59E0B", "#FF6B6B", "#4ECDC4", "#45B7D1"];
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 1.5 + Math.random() * 2;
        const size = 6 + Math.random() * 8;
        const color = colors[i % colors.length];
        const rotate = Math.random() * 360;
        const drift = (Math.random() - 0.5) * 40;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "-10px",
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: color,
              borderRadius: "2px",
              transform: `rotate(${rotate}deg)`,
              animation: `confetti-fall ${duration}s ease-out ${delay}s forwards`,
              ["--drift" as string]: `${drift}px`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) translateX(var(--drift)) rotate(720deg); }
        }
      `}</style>
    </div>
  );
}

export default function ProgressPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitedPanelIds, setVisitedPanelIds] = useState<Set<string>>(new Set());
  const [expandedPrefecture, setExpandedPrefecture] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [conqueredPref, setConqueredPref] = useState<string | null>(null);
  const { requireAuth } = useRequireAuth();
  const prevConqueredRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setVisitedPanelIds(getVisitedPanelIds());
    getPanels().then((data) => {
      setPanels(data);
      setLoading(false);
    });
  }, []);

  // Track which prefectures were conquered before
  useEffect(() => {
    if (panels.length === 0) return;
    const panelsByPref: Record<string, Panel[]> = {};
    panels.forEach((p) => {
      if (!panelsByPref[p.prefecture]) panelsByPref[p.prefecture] = [];
      panelsByPref[p.prefecture].push(p);
    });
    const currentConquered = new Set<string>();
    PREFECTURES.forEach((pref) => {
      const pp = panelsByPref[pref.name];
      if (pp && pp.length > 0 && pp.every((p) => visitedPanelIds.has(p.id))) {
        currentConquered.add(pref.name);
      }
    });
    // Detect newly conquered prefecture
    if (prevConqueredRef.current.size > 0 || visitedPanelIds.size > 0) {
      for (const name of currentConquered) {
        if (!prevConqueredRef.current.has(name)) {
          setShowConfetti(true);
          setConqueredPref(name);
          setTimeout(() => { setShowConfetti(false); setConqueredPref(null); }, 3500);
          break;
        }
      }
    }
    prevConqueredRef.current = currentConquered;
  }, [visitedPanelIds, panels]);

  const togglePanelVisited = useCallback((panelId: string) => {
    if (!requireAuth()) return;
    setVisitedPanelIds((prev) => {
      const next = new Set(prev);
      if (next.has(panelId)) {
        next.delete(panelId);
      } else {
        next.add(panelId);
      }
      saveVisitedPanelIds(next);
      return next;
    });
  }, [requireAuth]);

  // Group panels by prefecture
  const panelsByPrefecture = panels.reduce(
    (acc, p) => {
      if (!acc[p.prefecture]) acc[p.prefecture] = [];
      acc[p.prefecture].push(p);
      return acc;
    },
    {} as Record<string, Panel[]>
  );

  // Check if a prefecture is fully conquered
  const isPrefectureConquered = (prefName: string): boolean => {
    const prefPanels = panelsByPrefecture[prefName];
    if (!prefPanels || prefPanels.length === 0) return false;
    return prefPanels.every((p) => visitedPanelIds.has(p.id));
  };

  // Count visited panels in a prefecture
  const getVisitedCount = (prefName: string): number => {
    const prefPanels = panelsByPrefecture[prefName];
    if (!prefPanels) return 0;
    return prefPanels.filter((p) => visitedPanelIds.has(p.id)).length;
  };

  const conqueredPrefectures = PREFECTURES.filter((p) =>
    isPrefectureConquered(p.name)
  ).length;
  const totalVisitedPanels = visitedPanelIds.size;
  const progressPercent = Math.round((conqueredPrefectures / 47) * 100);

  // Share function
  const sharePrefecture = useCallback(async (prefName: string) => {
    const prefPanels = panelsByPrefecture[prefName] || [];
    const text = `🎉 ${prefName}の顔ハメパネル ${prefPanels.length}箇所 全制覇しました！\n\n#カオハメJAPAN #顔ハメパネル #${prefName}`;
    const url = "https://kaohame-japan.vercel.app";
    if (navigator.share) {
      try {
        await navigator.share({ title: `${prefName} 制覇！`, text, url });
      } catch { /* user cancelled */ }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert("クリップボードにコピーしました！");
    }
  }, [panelsByPrefecture]);

  const shareOverall = useCallback(async () => {
    const text = `🏆 カオハメJAPAN ${conqueredPrefectures}/47 都道府県制覇中！\n${totalVisitedPanels}箇所のパネルを訪問済み\n\n#カオハメJAPAN #顔ハメパネル`;
    const url = "https://kaohame-japan.vercel.app";
    if (navigator.share) {
      try {
        await navigator.share({ title: "カオハメJAPAN 制覇状況", text, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert("クリップボードにコピーしました！");
    }
  }, [conqueredPrefectures, totalVisitedPanels]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-200 border-t-yellow-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* Confetti */}
      <Confetti active={showConfetti} />

      {/* Conquest celebration modal */}
      {conqueredPref && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 animate-bounce rounded-2xl bg-white p-6 text-center shadow-2xl" style={{ animationDuration: "0.6s", animationIterationCount: "2" }}>
            <p className="text-5xl">🎉</p>
            <p className="mt-3 text-xl font-bold text-gray-900">{conqueredPref} 制覇！</p>
            <p className="mt-1 text-sm text-gray-500">全パネルを訪問しました！</p>
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => sharePrefecture(conqueredPref)}
                className="rounded-full bg-yellow-500 px-5 py-2 text-sm font-bold text-white active:scale-95 transition-transform"
              >
                シェアする
              </button>
              <button
                onClick={() => { setConqueredPref(null); setShowConfetti(false); }}
                className="rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-600 active:scale-95 transition-transform"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">制覇マップ</h1>
        <p className="text-sm text-gray-500">
          各都道府県のパネルを全制覇しよう！
        </p>
      </header>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 text-white">
        <div className="text-center">
          <p className="text-5xl font-bold">{conqueredPrefectures}/47</p>
          <p className="mt-1 text-sm opacity-90">都道府県を制覇</p>

          <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs opacity-80">
            {progressPercent}% 達成 ・ {totalVisitedPanels}/{panels.length} パネル訪問済
          </p>
        </div>

        {/* Share progress button */}
        {conqueredPrefectures > 0 && (
          <div className="mt-3 text-center">
            <button
              onClick={shareOverall}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white active:scale-95 transition-transform"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              進捗をシェア
            </button>
          </div>
        )}

        {conqueredPrefectures >= 47 && (
          <div className="mt-3 text-center">
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-yellow-900">
              🎉 全国制覇達成！ 🎉
            </span>
          </div>
        )}
        {conqueredPrefectures >= 5 && conqueredPrefectures < 47 && (
          <div className="mt-3 text-center">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-medium">
              {conqueredPrefectures >= 30
                ? "マスター級！あと少し！"
                : conqueredPrefectures >= 20
                  ? "旅の達人！"
                  : conqueredPrefectures >= 10
                    ? "いい調子！"
                    : "順調！がんばろう！"}
            </span>
          </div>
        )}
      </div>

      {/* Prefecture list by region */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {REGIONS.map((region) => {
          const prefs = PREFECTURES.filter((p) => p.region === region);
          const regionConquered = prefs.filter((p) =>
            isPrefectureConquered(p.name)
          ).length;

          return (
            <div key={region} className="rounded-xl bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">{region}</h2>
                <span className="text-xs text-gray-500">
                  {regionConquered}/{prefs.length} 制覇
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {prefs.map((pref) => {
                  const prefPanels = panelsByPrefecture[pref.name] || [];
                  const visitedCount = getVisitedCount(pref.name);
                  const totalCount = prefPanels.length;
                  const isConquered = isPrefectureConquered(pref.name);
                  const isExpanded = expandedPrefecture === pref.name;
                  const hasPanel = totalCount > 0;

                  return (
                    <div key={pref.name}>
                      {/* Prefecture row */}
                      <button
                        onClick={() => {
                          if (hasPanel) {
                            setExpandedPrefecture(isExpanded ? null : pref.name);
                          }
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          hasPanel ? "hover:bg-gray-50" : "opacity-50"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isConquered
                              ? "bg-yellow-500"
                              : hasPanel && visitedCount > 0
                                ? "bg-yellow-200"
                                : "bg-gray-100"
                          }`}
                        >
                          {prefecturePaths[pref.name] ? (
                            <svg viewBox="0 0 100 100" className="h-5 w-5">
                              <path
                                d={prefecturePaths[pref.name]}
                                fill={
                                  isConquered
                                    ? "white"
                                    : hasPanel && visitedCount > 0
                                      ? "#CA8A04"
                                      : "#9CA3AF"
                                }
                              />
                            </svg>
                          ) : (
                            <span className={`text-xs ${isConquered ? "text-white" : "text-gray-400"}`}>
                              {isConquered ? "✓" : ""}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                isConquered ? "text-yellow-600" : hasPanel ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {pref.name}
                              {isConquered && " 👑"}
                            </span>
                          </div>
                          {hasPanel && (
                            <div className="mt-1 flex items-center gap-2">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    isConquered ? "bg-yellow-500" : "bg-yellow-300"
                                  }`}
                                  style={{
                                    width: `${totalCount > 0 ? (visitedCount / totalCount) * 100 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                {visitedCount}/{totalCount}
                              </span>
                            </div>
                          )}
                        </div>
                        {isConquered && (
                          <button
                            onClick={(e) => { e.stopPropagation(); sharePrefecture(pref.name); }}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 active:scale-90 transition-transform"
                            aria-label="シェア"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </button>
                        )}
                        {hasPanel && (
                          <svg
                            className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                        {!hasPanel && (
                          <span className="text-[10px] text-gray-300">パネル未登録</span>
                        )}
                      </button>

                      {/* Expanded panel list */}
                      {isExpanded && hasPanel && (
                        <div className="bg-gray-50 px-4 py-2 space-y-1">
                          {prefPanels.map((panel, index) => {
                            const isVisited = visitedPanelIds.has(panel.id);
                            return (
                              <button
                                key={panel.id}
                                onClick={() => togglePanelVisited(panel.id)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                                  isVisited
                                    ? "bg-yellow-50 border border-yellow-200"
                                    : "bg-white border border-gray-100"
                                }`}
                              >
                                <div
                                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                                    isVisited
                                      ? "border-yellow-500 bg-yellow-500"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isVisited ? (
                                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <span className="text-[10px] font-bold text-gray-400">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm truncate ${isVisited ? "text-yellow-700 font-medium" : "text-gray-700"}`}>
                                    <span className={`mr-1.5 text-xs ${isVisited ? "text-yellow-400" : "text-gray-400"}`}>
                                      #{index + 1}
                                    </span>
                                    {panel.name}
                                  </p>
                                </div>
                                {isVisited && (
                                  <span className="text-xs text-yellow-500 font-medium whitespace-nowrap">
                                    行った！
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
