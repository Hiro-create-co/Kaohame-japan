import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ prefecture: string }>;
}) {
  const { prefecture } = await params;
  const prefName = decodeURIComponent(prefecture);

  // Get panel count for this prefecture
  const { count } = await supabase
    .from("panels")
    .select("*", { count: "exact", head: true })
    .eq("prefecture", prefName);

  const panelCount = count || 0;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
          }}
        />

        {/* Crown emoji */}
        <div style={{ fontSize: 80, display: "flex" }}>👑</div>

        {/* Prefecture name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginTop: 10,
            textShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
          }}
        >
          {prefName}
        </div>

        {/* Conquest text */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "white",
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span>🎉</span>
          <span>全制覇！</span>
          <span>🎉</span>
        </div>

        {/* Panel count */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.85)",
            marginTop: 20,
            background: "rgba(255,255,255,0.15)",
            borderRadius: 40,
            padding: "10px 32px",
            display: "flex",
          }}
        >
          顔ハメパネル {panelCount}箇所 コンプリート
        </div>

        {/* App name */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "rgba(255,255,255,0.7)",
              display: "flex",
            }}
          >
            カオハメJAPAN
          </div>
          <div
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
            }}
          >
            47都道府県の顔ハメパネルを制覇しよう
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
