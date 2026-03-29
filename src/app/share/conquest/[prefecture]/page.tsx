import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const prefName = decodeURIComponent(prefecture);

  const { count } = await supabase
    .from("panels")
    .select("*", { count: "exact", head: true })
    .eq("prefecture", prefName);

  const title = `${prefName} 全制覇！ | カオハメJAPAN`;
  const description = `${prefName}の顔ハメパネル${count || 0}箇所を全制覇しました！あなたも47都道府県の顔ハメパネルを制覇しよう！`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "カオハメJAPAN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ConquestSharePage({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  // SNS crawlers will see the OGP metadata above
  // Real users get redirected to the app
  const { prefecture } = await params;
  void prefecture; // unused - just for params
  redirect("/progress");
}
