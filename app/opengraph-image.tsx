import { ImageResponse } from "next/og";

export const alt = "Dropoff";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827, #000000)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 700 }}>Dropoff</div>
        <div style={{ fontSize: 34, opacity: 0.7, marginTop: 12 }}>
          Is it worth your time?
        </div>
      </div>
    ),
    { ...size }
  );
}
