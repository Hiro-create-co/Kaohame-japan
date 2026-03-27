import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: panel } = await supabase
    .from("panels")
    .select("name, prefecture, description")
    .eq("id", id)
    .single();

  if (!panel) {
    return {
      title: "パネルが見つかりません | カオハメJAPAN",
    };
  }

  const title = `${panel.name}（${panel.prefecture}）| カオハメJAPAN`;
  const description =
    panel.description ||
    `${panel.prefecture}にある「${panel.name}」の顔ハメパネル情報`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "カオハメJAPAN",
      locale: "ja_JP",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function PanelLayout({ children }: Props) {
  return <>{children}</>;
}
