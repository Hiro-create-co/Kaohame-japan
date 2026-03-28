"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  getPanelById,
  getPhotosByPanel,
  uploadPhoto,
  isPanelLiked,
  likePanel,
  unlikePanel,
  isPhotoLiked,
  likePhoto,
  unlikePhoto,
} from "@/lib/panels";
import type { Panel, PanelPhoto } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/contexts/AuthContext";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PanelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { requireAuth } = useRequireAuth();
  const { displayName } = useAuth();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<PanelPhoto[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Photo upload state
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lightbox state
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const panelId = params.id as string;

      getPanelById(panelId).then((data) => {
        setPanel(data);
        setLikeCount(data?.like_count || 0);
        setLoading(false);
      });

      getPhotosByPanel(panelId).then(setPhotos);

      setLiked(isPanelLiked(panelId));

      // Load default user name from localStorage
      const defaultName = localStorage.getItem("kaohame_default_name") || "";
      setUserName(defaultName);
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

  const handleLikeToggle = async () => {
    if (!panel) return;
    if (!requireAuth()) return;
    if (liked) {
      const newCount = await unlikePanel(panel.id);
      if (newCount !== null) {
        setLiked(false);
        setLikeCount(newCount);
      }
    } else {
      const newCount = await likePanel(panel.id);
      if (newCount !== null) {
        setLiked(true);
        setLikeCount(newCount);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !panel) return;
    setUploading(true);
    const photo = await uploadPhoto(panel.id, selectedFile, userName);
    setUploading(false);

    if (photo) {
      setPhotos((prev) => [photo, ...prev]);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setShowUpload(false);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      alert("アップロードに失敗しました。もう一度お試しください。");
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setShowUpload(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500" />
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
          className="mt-4 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white"
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
        <div className="h-40 overflow-hidden">
          <MapView
            panels={[panel]}
            center={[panel.latitude, panel.longitude]}
            zoom={15}
            mini
          />
        </div>

        {/* Panel Info */}
        <div className="p-4 space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <img
                src={panel.image_url || "/default-panel.jpg"}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {panel.name}
                </h2>
                <p className="text-sm font-medium text-amber-500">
                  {panel.prefecture}
                </p>
              </div>
              {/* Like button */}
              <button
                onClick={handleLikeToggle}
                className="flex flex-col items-center gap-0.5"
                title={liked ? "いいね解除" : "いいね"}
              >
                <svg
                  className={`h-7 w-7 transition-colors ${
                    liked ? "text-amber-500" : "text-gray-300"
                  }`}
                  fill={liked ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-500">
                  {likeCount}
                </span>
              </button>
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
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              Google Maps
            </a>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-amber-500 shadow-sm transition-colors hover:bg-amber-50"
            >
              <svg
                className="h-4 w-4"
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
              シェア
            </button>
          </div>

          {/* Photo Gallery Section */}
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">
                みんなの写真 ({photos.length})
              </h3>
              <button
                onClick={() => {
                  if (!requireAuth()) return;
                  setShowUpload(true);
                  if (displayName) setUserName(displayName);
                }}
                className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600"
              >
                写真を投稿
              </button>
            </div>

            {/* Upload Form */}
            {showUpload && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="プレビュー"
                      className="w-full max-h-48 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (previewUrl) URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-28 rounded-lg border-2 border-dashed border-amber-300 flex flex-col items-center justify-center gap-1.5 text-amber-300 hover:border-amber-400 hover:text-amber-400 transition-colors bg-white/50"
                  >
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                    </svg>
                    <span className="text-xs font-medium">タップして写真を選択</span>
                  </button>
                )}

                <input
                  type="text"
                  placeholder="ニックネーム（任意）"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleUploadSubmit}
                    disabled={!selectedFile || uploading}
                    className="flex-1 rounded-full bg-amber-500 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "アップロード中..." : "投稿する"}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}

            {/* Photo Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => (
                  <div key={photo.id} className="rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                    <button
                      onClick={() => setLightboxPhoto(photo.image_url)}
                      className="relative aspect-square w-full overflow-hidden"
                    >
                      <img
                        src={photo.image_url}
                        alt={`${photo.user_name}さんの写真`}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </button>
                    <div className="flex items-center justify-between px-2 py-1.5 bg-white">
                      <span className="text-[10px] text-gray-400 truncate">
                        {photo.user_name}
                      </span>
                      <button
                        onClick={async () => {
                          if (!requireAuth()) return;
                          const photoLiked = isPhotoLiked(photo.id);
                          const newCount = photoLiked
                            ? await unlikePhoto(photo.id)
                            : await likePhoto(photo.id);
                          if (newCount !== null) {
                            setPhotos((prev) =>
                              prev.map((p) =>
                                p.id === photo.id
                                  ? { ...p, like_count: newCount }
                                  : p
                              )
                            );
                          }
                        }}
                        className="flex items-center gap-0.5"
                      >
                        <svg
                          className={`h-3.5 w-3.5 ${
                            isPhotoLiked(photo.id)
                              ? "text-amber-400"
                              : "text-gray-300"
                          }`}
                          fill={isPhotoLiked(photo.id) ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span className="text-[10px] text-gray-400">
                          {photo.like_count || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">
                まだ写真がありません。最初の写真を投稿しよう！
              </p>
            )}
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

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={lightboxPhoto}
            alt="拡大写真"
            className="max-h-full max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
