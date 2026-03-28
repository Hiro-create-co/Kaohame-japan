import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage() {
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
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={imgBase64}
          width={280}
          height={280}
          style={{ marginBottom: 20, borderRadius: 24 }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
          }}
        >
          カオハメJAPAN
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          47都道府県の顔ハメパネルを制覇しよう！
        </div>
      </div>
    ),
    { ...size }
  );
}
