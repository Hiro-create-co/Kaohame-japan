"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginModal() {
  const {
    showLoginModal,
    setShowLoginModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  if (!showLoginModal) return null;

  const handleClose = () => {
    setShowLoginModal(false);
    setError(null);
    setEmail("");
    setPassword("");
    setIsSignUp(false);
    setSignUpSuccess(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp) {
      const err = await signUpWithEmail(email, password);
      if (err) {
        setError(err);
      } else {
        setSignUpSuccess(true);
      }
    } else {
      const err = await signInWithEmail(email, password);
      if (err) {
        setError(err);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Googleログインに失敗しました");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 pb-8 sm:pb-6 shadow-xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="h-5 w-5 text-gray-400"
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

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            ログインが必要です
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            この機能を使うにはログインしてください
          </p>
        </div>

        {signUpSuccess ? (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-sm font-medium text-green-800">
              確認メールを送信しました
            </p>
            <p className="mt-1 text-xs text-green-600">
              メール内のリンクをクリックしてアカウントを有効化してください
            </p>
            <button
              onClick={handleClose}
              className="mt-3 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white"
            >
              閉じる
            </button>
          </div>
        ) : (
          <>
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Googleでログイン
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">または</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  required
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="パスワード（6文字以上）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-yellow-500 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-yellow-600 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    処理中...
                  </span>
                ) : isSignUp ? (
                  "アカウント作成"
                ) : (
                  "メールでログイン"
                )}
              </button>
            </form>

            {/* Toggle */}
            <p className="mt-4 text-center text-xs text-gray-500">
              {isSignUp ? (
                <>
                  すでにアカウントをお持ちですか？{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(false);
                      setError(null);
                    }}
                    className="font-medium text-yellow-500"
                  >
                    ログイン
                  </button>
                </>
              ) : (
                <>
                  アカウントをお持ちでないですか？{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setError(null);
                    }}
                    className="font-medium text-yellow-500"
                  >
                    新規登録
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
