"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { addPanel } from "@/lib/panels";
import { PREFECTURES } from "@/data/prefectures";

export default function AddPanelPage() {
  const router = useRouter();
  const { latitude, longitude, loading: geoLoading, error: geoError } = useGeolocation();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    prefecture: "",
    latitude: "",
    longitude: "",
    contributor_name: "",
  });

  useEffect(() => {
    const savedName = localStorage.getItem("kaohame_default_name");
    if (savedName) {
      setForm((prev) => ({ ...prev, contributor_name: savedName }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const lat = useCurrentLocation
      ? latitude
      : parseFloat(form.latitude);
    const lng = useCurrentLocation
      ? longitude
      : parseFloat(form.longitude);

    if (!lat || !lng) {
      alert("位置情報を入力してください");
      setSubmitting(false);
      return;
    }

    const result = await addPanel({
      name: form.name,
      description: form.description,
      prefecture: form.prefecture,
      latitude: lat,
      longitude: lng,
      image_url: null,
      contributor_name: form.contributor_name || "匿名",
    });

    if (result) {
      setSuccess(true);
      setTimeout(() => {
        router.push(`/panels/${result.id}`);
      }, 1000);
    } else {
      alert("登録に失敗しました。もう一度お試しください。");
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-xl font-bold text-gray-900">登録完了！</h2>
          <p className="mt-2 text-sm text-gray-500">
            パネルが登録されました。ありがとう！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="bg-white px-4 py-3 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900">パネルを登録</h1>
        <p className="text-xs text-gray-500">
          見つけた顔ハメパネルをみんなとシェアしよう
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-4 pb-28 space-y-4"
      >
        {/* Panel Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            パネル名 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="例: 熊本城くまモンパネル"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Prefecture */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            都道府県 <span className="text-rose-500">*</span>
          </label>
          <select
            required
            value={form.prefecture}
            onChange={(e) => updateField("prefecture", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white"
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            rows={3}
            placeholder="パネルの場所や特徴を教えてください"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            位置情報 <span className="text-rose-500">*</span>
          </label>

          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setUseCurrentLocation(true)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                useCurrentLocation
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              現在地を使う
            </button>
            <button
              type="button"
              onClick={() => setUseCurrentLocation(false)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !useCurrentLocation
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              手動入力
            </button>
          </div>

          {useCurrentLocation ? (
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              {geoLoading ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
                  位置情報を取得中...
                </div>
              ) : latitude && longitude ? (
                <div>
                  <p className="text-blue-700 font-medium">
                    現在地を取得しました
                  </p>
                  <p className="text-blue-600 text-xs mt-1">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-amber-600 font-medium">
                    位置情報を取得できません
                  </p>
                  <p className="text-amber-500 text-xs mt-1">
                    {geoError || "手動入力をお使いください"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-0.5 block">緯度</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="例: 35.6812"
                    value={form.latitude}
                    onChange={(e) => updateField("latitude", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-0.5 block">経度</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="例: 139.7671"
                    value={form.longitude}
                    onChange={(e) => updateField("longitude", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Google Maps で場所を長押しすると座標をコピーできます
              </p>
            </div>
          )}
        </div>

        {/* Contributor Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            あなたの名前（任意）
          </label>
          <input
            type="text"
            placeholder="匿名でもOK"
            value={form.contributor_name}
            onChange={(e) => updateField("contributor_name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !form.name || !form.prefecture}
          className="w-full rounded-xl bg-rose-600 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-rose-700 active:scale-[0.98] disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              登録中...
            </span>
          ) : (
            "パネルを登録する"
          )}
        </button>
      </form>
    </div>
  );
}
