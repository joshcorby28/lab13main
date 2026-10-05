import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        source: "/work/:slug",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
