import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#11110f",
          color: "#ece7de",
          fontSize: 22,
          letterSpacing: "-0.04em",
          fontWeight: 500,
        }}
      >
        13
      </div>
    ),
    size,
  );
}
