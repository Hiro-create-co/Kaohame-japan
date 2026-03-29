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

          <p>
            本利用規約（以下「本規約」といいます。）は、個人事業主 山田紘也（以下「当社」といいます。）が提供する、顔ハメパネル制覇サービス「カオハメJAPAN」および関連ウェブサイト・アプリケーション（以下総称して「本サービス」といいます。）の利用条件を定めるものです。
          </p>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第1条（総則）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本規約は、本サービスの利用に関する当社と利用者（第2条で定義します。）との間の一切の関係に適用されます。</li>
              <li>本サービスを利用する全ての方（アカウント登録の有無を問わず、以下「利用者」といいます。）は、本規約に同意したものとみなされます。</li>
              <li>当社が別途定めるガイドライン、プライバシーポリシー、注意事項その他の規定（以下「個別規定」といいます。）は本規約の一部を構成するものとし、本規約と個別規定が矛盾する場合は個別規定が優先します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第2条（サービスの定義・内容）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本サービスは、日本全国の顔ハメパネル（顔出しパネル）の位置情報を共有・記録し、都道府県ごとの制覇状況を管理するWebアプリケーションです。</li>
              <li>
                主な機能は以下のとおりです。
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  <li>顔ハメパネルの位置情報の閲覧・検索・地図表示</li>
                  <li>新しいパネル情報の登録</li>
                  <li>写真の投稿・閲覧</li>
                  <li>いいね機能</li>
                  <li>都道府県ごとの制覇状況の記録・シェア</li>
                  <li>ランキング機能</li>
                </ul>
              </li>
              <li>当社は、必要に応じて本サービスの機能を追加・変更・削除できるものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第3条（利用条件）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本サービスを利用できる年齢は13歳以上とします。未成年者が利用する場合は親権者の同意を要します。</li>
              <li>一部機能の利用（パネル登録、写真投稿、いいね等）にあたっては、Googleアカウントまたはメールアドレスによるアカウント登録が必要です。</li>
              <li>利用者は、自己の責任において、ID・パスワード等の認証情報を適切に管理するものとし、第三者による不正利用について当社は責任を負いません。</li>
              <li>利用者は、本サービスの利用に必要な端末、通信環境その他一切の利用環境を、自己の責任と費用負担で用意するものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第4条（禁止事項）</h2>
            <p>利用者は、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ol className="mt-2 list-decimal pl-5 space-y-1">
              <li>法令・公序良俗に違反する行為</li>
              <li>虚偽の位置情報やパネル情報の登録</li>
              <li>他者の権利・プライバシーを侵害する写真の投稿</li>
              <li>公序良俗に反するコンテンツの投稿</li>
              <li>不正アクセス、リバースエンジニアリング、システムへの過度な負荷</li>
              <li>スクレイピング等による大量データ取得</li>
              <li>本サービスの全部または一部を無断で複製・転用・販売・再配布する行為</li>
              <li>本サービスの運営を妨害する行為、または当社の信用を毀損する行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第5条（料金・課金）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本サービスは基本的に無料で提供されます。</li>
              <li>将来的に有料機能やサブスクリプションを導入する場合、当社は別途契約条件を定め、利用者に周知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第6条（投稿コンテンツ・知的財産権）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本サービスおよび関連ソフトウェア・ロゴ・テキスト等に関する知的財産権は当社または正当な権利者に帰属します。</li>
              <li>利用者が投稿したパネル情報・写真等（以下「投稿コンテンツ」）の著作権は利用者に帰属します。ただし、利用者は当社に対し、本サービスの運営・改善、統計的分析、マーケティング資料作成の範囲で、投稿コンテンツを無償で利用（複製・公衆送信・翻案等）する非独占的ライセンスを許諾するものとします。</li>
              <li>当社は、法令違反や本規約に反する投稿コンテンツを、事前の通知なく削除できるものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第7条（個人情報の取扱い）</h2>
            <p>
              当社は、利用者の個人情報を別途定めるプライバシーポリシーに従い適切に管理します。
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第8条（免責事項）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本サービスに掲載されるパネル情報の正確性、最新性について保証しません。パネルが移動・撤去されている場合があります。</li>
              <li>本サービスの利用に起因して利用者または第三者に生じた損害（交通事故、迷子等を含む）について、当社の故意または重過失による場合を除き責任を負いません。</li>
              <li>本サービスは現状有姿で提供され、特定目的への適合性を保証しません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第9条（サービスの停止・変更）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                当社は、以下の場合に本サービスの全部または一部を停止または終了することがあります。
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  <li>システム保守、障害、緊急事態が生じた場合</li>
                  <li>法令変更または行政指導等への対応が必要な場合</li>
                  <li>その他、当社がやむを得ないと判断した場合</li>
                </ul>
              </li>
              <li>当社は、前項の場合、可能な範囲で事前に利用者へ通知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第10条（利用制限・契約解除）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>利用者が本規約に違反した場合、当社は事前通知なくアカウント停止・削除等の措置を取ることができます。</li>
              <li>利用者は、当社所定の方法で退会手続きを行うことにより、本サービスの利用契約を終了できます。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第11条（規約の改定）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>当社は、合理的な範囲で本規約を改定することがあります。</li>
              <li>改定後の本規約は、当社ウェブサイト等に掲示した時点で効力を生じます。</li>
              <li>重大な変更を行う場合、効力発生日の30日前までに通知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-gray-900">第12条（準拠法・裁判管轄）</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>本規約は日本法に準拠し解釈されます。</li>
              <li>本サービスに関連して紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ol>
          </section>

          <div className="mt-8 space-y-2 text-xs text-gray-500">
            <p>制定日：2026年3月29日</p>
            <p>最終改定日：2026年3月29日</p>
          </div>

          <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-600">本規約に関するお問い合わせ</p>
            <p>個人事業主 山田紘也</p>
            <p>〒107-0052 東京都港区赤坂4丁目8番19号 赤坂フロントタウン3階</p>
            <p>E‑mail：info@hirovision.jp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
