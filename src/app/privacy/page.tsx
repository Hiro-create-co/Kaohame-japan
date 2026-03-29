import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | カオハメJAPAN",
  description: "カオハメJAPANのプライバシーポリシー",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">プライバシーポリシー</h1>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="mx-auto max-w-2xl space-y-6 text-sm text-gray-700 leading-relaxed">
          <p className="text-xs text-gray-400">最終更新日: 2026年3月29日</p>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">1. はじめに</h2>
            <p>
              カオハメJAPAN（以下「本サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーでは、本サービスにおける個人情報の取扱いについて説明します。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">2. 収集する情報</h2>
            <p>本サービスでは、以下の情報を収集する場合があります。</p>

            <h3 className="mt-3 mb-1 font-bold text-gray-800">2.1 アカウント情報</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>メールアドレス（メール認証の場合）</li>
              <li>Googleアカウント情報（Google認証の場合：表示名、プロフィール画像）</li>
            </ul>

            <h3 className="mt-3 mb-1 font-bold text-gray-800">2.2 投稿情報</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>パネルの位置情報（緯度・経度）</li>
              <li>パネル名、説明文</li>
              <li>投稿写真</li>
              <li>ニックネーム</li>
            </ul>

            <h3 className="mt-3 mb-1 font-bold text-gray-800">2.3 位置情報</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>現在地表示機能を利用する場合のみ、端末の位置情報を取得します</li>
              <li>位置情報はブラウザ上でのみ使用し、サーバーには送信・保存しません</li>
              <li>位置情報の利用はユーザーの明示的な許可が必要です</li>
            </ul>

            <h3 className="mt-3 mb-1 font-bold text-gray-800">2.4 端末に保存する情報</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>制覇状況（訪問済みパネルの記録）</li>
              <li>いいねの履歴</li>
              <li>デフォルトニックネーム</li>
            </ul>
            <p className="mt-1 text-xs text-gray-500">※ これらはlocalStorageに保存され、サーバーには送信されません。</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">3. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>本サービスの提供・運営</li>
              <li>ユーザー認証</li>
              <li>パネル情報の公開・共有</li>
              <li>サービスの改善・新機能の開発</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">4. 情報の第三者提供</h2>
            <p>
              運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護に必要な場合</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">5. 外部サービス</h2>
            <p>本サービスでは、以下の外部サービスを利用しています。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                <strong>Supabase</strong> — データベース・認証・ファイルストレージの提供
                <br />
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline">
                  Supabaseプライバシーポリシー
                </a>
              </li>
              <li>
                <strong>Google認証</strong> — OAuth2.0によるログイン
                <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline">
                  Googleプライバシーポリシー
                </a>
              </li>
              <li>
                <strong>Vercel</strong> — ホスティング
                <br />
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline">
                  Vercelプライバシーポリシー
                </a>
              </li>
              <li>
                <strong>OpenStreetMap</strong> — 地図データの表示
                <br />
                <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline">
                  OpenStreetMapプライバシーポリシー
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">6. データの保管</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>投稿データはSupabaseのサーバー（クラウド）に保存されます</li>
              <li>制覇状況・いいね履歴はユーザーの端末内（localStorage）にのみ保存されます</li>
              <li>アカウントを削除した場合、認証情報は削除されます</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">7. ユーザーの権利</h2>
            <p>ユーザーは以下の権利を有します。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>自身の投稿コンテンツの確認</li>
              <li>アカウントの削除の請求</li>
              <li>端末に保存されたデータの削除（設定ページから実行可能）</li>
              <li>位置情報の利用許可の取り消し（端末の設定から実行可能）</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">8. Cookie</h2>
            <p>
              本サービスでは、認証セッションの管理のためにCookieを使用します。広告目的のCookieは使用しません。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">9. 子どものプライバシー</h2>
            <p>
              本サービスは、13歳未満の子どもから意図的に個人情報を収集しません。13歳未満の方は、保護者の同意のもとでご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">10. ポリシーの変更</h2>
            <p>
              本プライバシーポリシーは、必要に応じて変更することがあります。重要な変更がある場合は、本サービス上でお知らせします。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">11. お問い合わせ</h2>
            <p>
              本プライバシーポリシーに関するお問い合わせは、アプリ内の設定ページよりご連絡ください。
            </p>
          </section>

          <div className="mt-8 rounded-lg bg-gray-100 p-4 text-xs text-gray-500">
            <p>運営: カオハメJAPAN</p>
            <p>お問い合わせ: アプリ内の設定ページよりご連絡ください</p>
          </div>
        </div>
      </div>
    </div>
  );
}
