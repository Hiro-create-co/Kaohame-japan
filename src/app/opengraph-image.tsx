import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OGImage() {
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
        <div
          style={{
            fontSize: 120,
            marginBottom: 20,
          }}
        >
          🎭
        </div>
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
