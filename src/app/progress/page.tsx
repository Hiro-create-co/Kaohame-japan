"use client";

import { useEffect, useState } from "react";
import { getPanels } from "@/lib/panels";
import { PREFECTURES, REGIONS } from "@/data/prefectures";
import { prefecturePaths } from "@/data/prefecturePaths";
import type { Panel } from "@/types";

export default function ProgressPage() {
  const [panels, setPanels] = useState<Panel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visitedPrefectures, setVisitedPrefectures] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const saved = localStorage.getItem("kaohame_visited");
    if (saved) {
      setVisitedPrefectures(new Set(JSON.parse(saved)));
    }

    getPanels().then((data) => {
      setPanels(data);
      setLoading(false);
    });
  }, []);

  const toggleVisited = (prefecture: string) => {
    setVisitedPrefectures((prev) => {
      const next = new Set(prev);
      if (next.has(prefecture)) {
        next.delete(prefecture);
      } else {
        next.add(prefecture);
      }
      localStorage.setItem("kaohame_visited", JSON.stringify([...next]));
      return next;
    });
  };

  const panelCountByPrefecture = panels.reduce(
    (acc, p) => {
      acc[p.prefecture] = (acc[p.prefecture] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalVisited = visitedPrefectures.size;
  const progressPercent = Math.round((totalVisited / 47) * 100);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">制覇マップ</h1>
        <p className="text-sm text-gray-500">
          顔ハメパネルで写真を撮った都道府県をチェック！
        </p>
      </header>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-amber-400 to-amber-500 p-6 text-white">
        <div className="text-center">
          <p className="text-5xl font-bold">{totalVisited}/47</p>
          <p className="mt-1 text-sm opacity-90">都道府県を制覇</p>

          <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs opacity-80">{progressPercent}% 達成</p>
        </div>

        {totalVisited >= 47 && (
          <div className="mt-3 text-center">
            <span className="inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-yellow-900">
              全国制覇達成！
            </span>
          </div>
        )}
        {totalVisited >= 10 && totalVisited < 47 && (
          <div className="mt-3 text-center">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-medium">
              {totalVisited >= 30
                ? "マスター級！あと少し！"
                : totalVisited >= 20
                  ? "旅の達人！"
                  : "いい調子！"}
            </span>
          </div>
        )}
      </div>

      {/* Prefecture list by region */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {REGIONS.map((region) => {
          const prefs = PREFECTURES.filter((p) => p.region === region);
          const regionVisited = prefs.filter((p) =>
            visitedPrefectures.has(p.name)
          ).length;

          return (
            <div key={region} className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">{region}</h2>
                <span className="text-xs text-gray-500">
                  {regionVisited}/{prefs.length}
                </span>
              </div>
              <div className="divide-y divide-gray-50">
                {prefs.map((pref) => {
                  const isVisited = visitedPrefectures.has(pref.name);
                  const count = panelCountByPrefecture[pref.name] || 0;

                  return (
                    <button
                      key={pref.name}
                      onClick={() => toggleVisited(pref.name)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                          isVisited ? "bg-amber-500" : "bg-gray-100"
                        }`}
                      >
                        {prefecturePaths[pref.name] ? (
                          <svg viewBox="0 0 100 100" className="h-5 w-5">
                            <path
                              d={prefecturePaths[pref.name]}
                              fill={isVisited ? "white" : "#9CA3AF"}
                            />
                          </svg>
                        ) : (
                          <span
                            className={`text-xs ${isVisited ? "text-white" : "text-gray-400"}`}
                          >
                            {isVisited ? "✓" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-sm font-medium ${
                            isVisited ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {pref.name}
                        </span>
                      </div>
                      {count > 0 && (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-500">
                          {count}件
                        </span>
                      )}
                    </button>
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
