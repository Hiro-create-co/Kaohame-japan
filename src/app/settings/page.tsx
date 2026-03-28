"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user, displayName, avatarUrl, signOut, setShowLoginModal } =
    useAuth();
  const [defaultName, setDefaultName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("kaohame_default_name");
    if (savedName) setDefaultName(savedName);
  }, []);

  const handleSaveName = (name: string) => {
    setDefaultName(name);
    localStorage.setItem("kaohame_default_name", name);
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        "制覇記録をすべてリセットしますか？\nこの操作は取り消せません。"
      )
    ) {
      localStorage.removeItem("kaohame_visited");
      alert("リセットしました");
    }
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        "すべてのデータ（制覇記録・いいね・設定）をリセットしますか？\nこの操作は取り消せません。"
      )
    ) {
      localStorage.clear();
      alert("すべてのデータをリセットしました");
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-gray-50 pb-24">
      <header className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">設定</h1>
      </header>

      <div className="space-y-3 p-4">
        {/* Account Section */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            アカウント
          </h2>

          {user ? (
            <div>
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-500 text-xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="mt-4 w-full rounded-xl border border-gray-300 py-3 text-base font-medium text-gray-600 transition-colors active:bg-gray-100"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div>
              <p className="text-base text-gray-600">
                ログインしていません
              </p>
              <p className="mt-1 text-sm text-gray-400">
                ログインすると、いいね・写真投稿・パネル登録ができます
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-4 w-full rounded-xl bg-yellow-500 py-3.5 text-base font-bold text-white transition-colors active:bg-yellow-600"
              >
                ログイン / 新規登録
              </button>
            </div>
          )}
        </section>

        {/* How to Use */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            使い方
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-base">
                🗾
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  マップで探す
                </p>
                <p className="text-sm text-gray-500">
                  全国の顔ハメパネルを地図で探せます。タップすると詳細が見れます。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-base">
                📸
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  写真を投稿する
                </p>
                <p className="text-sm text-gray-500">
                  パネルの詳細ページから写真を投稿できます。ログインが必要です。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-base">
                ➕
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  パネルを登録する
                </p>
                <p className="text-sm text-gray-500">
                  「追加」タブから新しいパネルの場所を登録できます。みんなで情報を共有しましょう！
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-base">
                🏆
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  都道府県を制覇する
                </p>
                <p className="text-sm text-gray-500">
                  「制覇」タブで訪れた都道府県をチェック。47都道府県コンプリートを目指そう！
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-base">
                ❤️
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  いいねする
                </p>
                <p className="text-sm text-gray-500">
                  お気に入りのパネルや写真にいいねできます。一番いいねが多い写真がマップのアイコンになります！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App Settings */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            アプリ設定
          </h2>

          <div className="space-y-4">
            {/* Default Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                デフォルトのニックネーム
              </label>
              <input
                type="text"
                placeholder="匿名"
                value={defaultName}
                onChange={(e) => handleSaveName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
              <p className="mt-1 text-sm text-gray-400">
                パネル登録時に自動で入力されます
              </p>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            データ管理
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleResetProgress}
              className="w-full rounded-xl border border-orange-200 bg-orange-50 py-3 text-base font-medium text-orange-600 transition-colors active:bg-orange-100"
            >
              制覇記録をリセット
            </button>
            <button
              onClick={handleResetAll}
              className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-base font-medium text-red-600 transition-colors active:bg-red-100"
            >
              すべてのデータをリセット
            </button>
          </div>
        </section>

        {/* App Info */}
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src="/icons/icon-192.png"
              alt="カオハメJAPAN"
              className="h-12 w-12 rounded-xl"
            />
            <div>
              <p className="text-base font-bold text-yellow-500">
                カオハメJAPAN
              </p>
              <p className="text-sm text-gray-500">v0.2.0</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            47都道府県の顔ハメパネルを制覇しよう！
          </p>
        </section>
      </div>
    </div>
  );
}
