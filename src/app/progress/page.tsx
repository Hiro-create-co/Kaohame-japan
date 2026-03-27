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
  const [showSettings, setShowSettings] = useState(false);
  const [defaultName, setDefaultName] = useState("");

  useEffect(() => {
    // Load visited from localStorage
    const saved = localStorage.getItem("kaohame_visited");
    if (saved) {
      setVisitedPrefectures(new Set(JSON.parse(saved)));
    }

    // Load default name
    const savedName = localStorage.getItem("kaohame_default_name");
    if (savedName) {
      setDefaultName(savedName);
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

  const handleSaveName = (name: string) => {
    setDefaultName(name);
    localStorage.setItem("kaohame_default_name", name);
  };

  const handleResetProgress = () => {
    if (window.confirm("制覇記録をすべてリセットしますか？この操作は取り消せません。")) {
      setVisitedPrefectures(new Set());
      localStorage.removeItem("kaohame_visited");
    }
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-900">制覇マップ</h1>
          <p className="text-xs text-gray-500">
            顔ハメパネルで写真を撮った都道府県をチェック！
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            showSettings ? "bg-rose-100 text-rose-600" : "hover:bg-gray-100 text-gray-500"
          }`}
          title="設定"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">設定</h2>

          {/* Default Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              デフォルトの名前（パネル登録時）
            </label>
            <input
              type="text"
              placeholder="匿名"
              value={defaultName}
              onChange={(e) => handleSaveName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              パネル登録時に自動で入力されます
            </p>
          </div>

          {/* Reset Progress */}
          <div>
            <button
              onClick={handleResetProgress}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              制覇記録をリセット
            </button>
            <p className="mt-1 text-xs text-gray-400">
              すべての都道府県のチェックが外れます
            </p>
          </div>

          {/* App Info */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
              <span className="font-bold text-rose-600">カオハメJAPAN</span>{" "}
              v0.1.0
            </p>
            <p className="mt-1 text-xs text-gray-400">
              47都道府県の顔ハメパネルを制覇しよう！
            </p>
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 text-white">
        <div className="text-center">
          <p className="text-5xl font-bold">{totalVisited}/47</p>
          <p className="mt-1 text-sm opacity-90">都道府県を制覇</p>

          {/* Progress Bar */}
          <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs opacity-80">{progressPercent}% 達成</p>
        </div>

        {/* Achievement badges */}
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
                          isVisited
                            ? "bg-rose-600"
                            : "bg-gray-100"
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
                          <span className={`text-xs ${isVisited ? "text-white" : "text-gray-400"}`}>
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
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-600">
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
