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

          <p className="text-xs text-gray-400">
            制定日：2026年3月29日<br />
            最終改定日：2026年3月29日
          </p>

          <p>
            個人事業主 山田紘也（所在地：〒107-0052 東京都港区赤坂4丁目8番19号 赤坂フロントタウン3階、以下「当方」といいます。）は、当方が提供する顔ハメパネル制覇サービス「カオハメJAPAN」（以下「本サービス」といいます。）におけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
          </p>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第1条（定義）</h2>
            <p>
              本ポリシーにおいて使用する用語は、個人情報の保護に関する法律その他関連法令に従うものとします。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第2条（取得する情報および利用目的）</h2>

            <h3 className="mt-3 mb-1 font-bold text-gray-800">取得する情報の種類</h3>

            <p className="mt-2 font-medium text-gray-800">1. アカウント情報</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>メールアドレス（メール認証の場合）</li>
              <li>Googleアカウント情報（Google認証の場合：表示名、プロフィール画像）</li>
            </ul>

            <p className="mt-3 font-medium text-gray-800">2. 投稿情報</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>パネルの位置情報（緯度・経度）</li>
              <li>パネル名、説明文</li>
              <li>投稿写真</li>
              <li>ニックネーム</li>
            </ul>

            <p className="mt-3 font-medium text-gray-800">3. 位置情報</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>現在地表示機能を利用する場合のみ、端末の位置情報を取得します</li>
              <li>位置情報はブラウザ上でのみ使用し、サーバーには送信・保存しません</li>
              <li>位置情報の利用はユーザーの明示的な許可が必要です</li>
            </ul>

            <p className="mt-3 font-medium text-gray-800">4. 端末に保存する情報</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>制覇状況（訪問済みパネルの記録）</li>
              <li>いいねの履歴</li>
              <li>デフォルトニックネーム</li>
            </ul>
            <p className="mt-1 text-xs text-gray-500">※ これらはブラウザのlocalStorageに保存され、サーバーには送信されません。</p>

            <p className="mt-3 font-medium text-gray-800">5. 利用履歴・アクセスログ</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>操作日時、機能利用状況、IPアドレス、ブラウザ情報等</li>
            </ul>

            <p className="mt-3 font-medium text-gray-800">6. Cookie等</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>認証セッション維持のためのCookie</li>
            </ul>

            <h3 className="mt-4 mb-1 font-bold text-gray-800">利用目的</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスの提供・維持・改善</li>
              <li>ユーザー認証</li>
              <li>パネル情報の公開・共有</li>
              <li>不正利用防止、セキュリティ監視</li>
              <li>統計データの作成・サービス改善</li>
              <li>法令等に基づく対応</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第3条（個人情報の第三者提供）</h2>
            <p>当方は、次の場合を除き、あらかじめユーザーの同意を得ることなく個人情報を第三者に提供しません。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>法令に基づく場合</li>
              <li>人の生命・身体・財産の保護のために必要で、本人同意を得ることが困難な場合</li>
              <li>公衆衛生向上または児童の健全育成のために特に必要で、本人同意を得ることが困難な場合</li>
              <li>国の機関等が法令の定める事務を遂行するために協力が必要な場合</li>
            </ul>
            <p className="mt-2">次の外部サービスに業務委託等の目的で情報を提供するとき（各社のプライバシーポリシーに基づき適切に管理されます）</p>
            <ul className="mt-2 list-disc pl-5 space-y-2">
              <li>
                <strong>Supabase, Inc.（米国）</strong>：認証、データベース、ファイルストレージの運用
                <br />
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline text-xs">
                  Supabaseプライバシーポリシー
                </a>
              </li>
              <li>
                <strong>Google LLC（米国）</strong>：OAuth2.0によるログイン認証
                <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline text-xs">
                  Googleプライバシーポリシー
                </a>
              </li>
              <li>
                <strong>Vercel Inc.（米国）</strong>：ホスティング
                <br />
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline text-xs">
                  Vercelプライバシーポリシー
                </a>
              </li>
              <li>
                <strong>OpenStreetMap Foundation（英国）</strong>：地図データの表示
                <br />
                <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline text-xs">
                  OpenStreetMapプライバシーポリシー
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第4条（外部委託）</h2>
            <p>
              当方は、サーバー運用・システム開発等を外部事業者に委託する場合、個人情報を適切に取り扱える事業者を選定し、機密保持契約を締結の上、監督します。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第5条（情報の保存期間）</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>サービス利用中のデータは継続して保存されます。</li>
              <li>ユーザーから削除依頼があった場合またはサービス退会後、法令で保存を義務付けられた期間を除き、速やかに個人情報を削除・匿名化します。</li>
              <li>端末に保存されたデータ（制覇状況・いいね履歴等）は、設定ページからユーザー自身で削除できます。</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第6条（ユーザーの権利）</h2>
            <p>ユーザーは、自己の個人情報について以下を請求できます。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>開示</li>
              <li>訂正、追加</li>
              <li>削除</li>
              <li>利用停止</li>
            </ul>
            <p className="mt-2">当方はご本人確認の上、合理的期間内に対応します。</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第7条（セキュリティ対策）</h2>
            <p>当方は以下のセキュリティ対策を講じます。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>TLSによる通信の暗号化</li>
              <li>Row-Level Security（RLS）によるデータベースアクセス制御</li>
              <li>認証済みユーザーのみが投稿・更新可能なポリシー設計</li>
              <li>PostgreSQLトリガーによるデータ改ざん防止</li>
              <li>ファイルアップロードのサイズ・形式制限</li>
              <li>入力値サニタイズ等によるXSS等の対策</li>
              <li>APIキーの秘匿管理</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第8条（Cookieの使用）</h2>
            <p>
              本サービスは、認証セッションの維持を目的としてCookieを利用します。広告目的のCookieは使用しません。Cookieの受け取りはブラウザ設定で拒否可能ですが、一部機能が利用できなくなる場合があります。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第9条（子どものプライバシー）</h2>
            <p>
              本サービスは、13歳未満の子どもから意図的に個人情報を収集しません。13歳未満の方は、保護者の同意のもとでご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第10条（国外への情報移転）</h2>
            <p>
              本サービスで利用する外部サービス（Supabase、Google、Vercel）のサーバーは、日本国外（主に米国）に所在する場合があります。これらのサービスへのデータ送信にあたっては、各事業者が適切な安全管理措置を講じていることを確認しています。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第11条（改訂）</h2>
            <p>
              当方は、本ポリシーを適宜改訂することがあります。重要な変更を行う場合は、当方ウェブサイト等で周知します。
            </p>
          </section>

          <div className="mt-8 rounded-lg bg-gray-100 p-4 text-xs text-gray-500 space-y-2">
            <p className="font-medium text-gray-600">本ポリシーに関するお問い合わせ</p>
            <p>個人情報の取扱いに関するご質問・ご相談は、下記メールアドレスまでご連絡ください。</p>
            <p>個人事業主 山田紘也</p>
            <p>〒107-0052 東京都港区赤坂4丁目8番19号 赤坂フロントタウン3階</p>
            <p>E‑mail：info@hirovision.jp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
