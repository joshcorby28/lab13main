import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ece7de",
          color: "#11110f",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          LAB×13
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, lineHeight: 0.92, letterSpacing: "-0.04em", maxWidth: 900 }}>
            Shopify experiences built to perform.
          </div>
          <div style={{ fontSize: 28, opacity: 0.62 }}>
            Thoughtfully crafted Shopify Plus stores & apps.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
