import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | カオハメJAPAN",
  description: "カオハメJAPANの利用規約",
};

export default function TermsPage() {
  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="bg-white px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">利用規約</h1>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="mx-auto max-w-2xl space-y-6 text-sm text-gray-700 leading-relaxed">
          <p className="text-xs text-gray-400">最終更新日: 2026年3月29日</p>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第1条（適用）</h2>
            <p>
              本利用規約（以下「本規約」）は、カオハメJAPAN（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーの皆さまは、本規約に同意のうえ、本サービスをご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第2条（サービス内容）</h2>
            <p>本サービスは、日本全国の顔ハメパネル（顔出しパネル）の位置情報を共有・記録し、都道府県ごとの制覇状況を管理するWebアプリケーションです。以下の機能を提供します。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>顔ハメパネルの位置情報の閲覧・検索</li>
              <li>新しいパネル情報の登録</li>
              <li>写真の投稿・閲覧</li>
              <li>いいね機能</li>
              <li>制覇状況の記録・シェア</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第3条（アカウント）</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>本サービスの一部機能（パネル登録、写真投稿、いいね等）を利用するには、Googleアカウントまたはメールアドレスによるユーザー登録が必要です。</li>
              <li>ユーザーは、自己の責任においてアカウントを管理するものとし、第三者に利用させてはなりません。</li>
              <li>アカウントの不正利用により生じた損害について、運営者は責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第4条（禁止事項）</h2>
            <p>ユーザーは、以下の行為を行ってはなりません。</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>虚偽の位置情報やパネル情報の登録</li>
              <li>他者の権利を侵害する写真の投稿</li>
              <li>公序良俗に反するコンテンツの投稿</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセスやシステムへの攻撃行為</li>
              <li>スクレイピング等による大量データ取得</li>
              <li>法令または本規約に違反する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第5条（投稿コンテンツ）</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>ユーザーが投稿したパネル情報・写真等（以下「投稿コンテンツ」）の著作権はユーザーに帰属します。</li>
              <li>ユーザーは、投稿コンテンツについて、本サービスの運営・改善・宣伝に必要な範囲で、無償で利用する権利を運営者に許諾するものとします。</li>
              <li>運営者は、法令違反や本規約に反する投稿コンテンツを、事前の通知なく削除できるものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第6条（免責事項）</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>本サービスに掲載されるパネル情報の正確性、最新性について保証しません。パネルが移動・撤去されている場合があります。</li>
              <li>本サービスの利用により生じた損害（交通事故、迷子等を含む）について、運営者は責任を負いません。</li>
              <li>本サービスは現状有姿で提供され、特定目的への適合性を保証しません。</li>
              <li>システム障害、メンテナンス等により、予告なくサービスを停止する場合があります。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第7条（サービスの変更・終了）</h2>
            <p>
              運営者は、ユーザーへの事前通知なく、本サービスの内容変更、一時停止、または終了することができるものとします。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第8条（規約の変更）</h2>
            <p>
              運営者は、必要に応じて本規約を変更できるものとします。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第9条（準拠法・管轄）</h2>
            <p>
              本規約は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
