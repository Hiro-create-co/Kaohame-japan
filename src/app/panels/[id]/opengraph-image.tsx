import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: panel } = await supabase
    .from("panels")
    .select("name, prefecture, description")
    .eq("id", id)
    .single();

  const name = panel?.name || "顔ハメパネル";
  const prefecture = panel?.prefecture || "";
  const description = panel?.description || "";

  const imgData = await readFile(join(process.cwd(), "public/ogp.png"));
  const imgBase64 = `data:image/png;base64,${imgData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #E11D48 0%, #BE123C 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: App name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 40,
          }}
        >
          <img
            src={imgBase64}
            width={48}
            height={48}
            style={{ borderRadius: 8 }}
          />
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            カオハメJAPAN
          </div>
        </div>

        {/* Middle: Panel info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            {name}
          </div>
          {prefecture && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 20,
                  padding: "8px 20px",
                  fontSize: 24,
                  color: "white",
                  fontWeight: 500,
                }}
              >
                {prefecture}
              </div>
            </div>
          )}
          {description && (
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.5,
                maxWidth: 800,
              }}
            >
              {description.length > 80
                ? description.slice(0, 80) + "..."
                : description}
            </div>
          )}
        </div>

        {/* Bottom: CTA */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          47都道府県の顔ハメパネルを制覇しよう！
        </div>
      </div>
    ),
    { ...size }
  );
}
