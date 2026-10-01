import type { NextConfig } from "next";
const mediaOrigin = process.env.MEDIA_ORIGIN;
const config: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  devIndicators: false,
  images: { remotePatterns: mediaOrigin ? [{ protocol: "https", hostname: new URL(mediaOrigin).hostname }] : [] },
  async rewrites() { return process.env.TRIPLINE_DEMO === "true" ? [] : [{ source: "/api/v1/:path*", destination: `${process.env.INTERNAL_API_URL || "http://localhost:8080"}/api/v1/:path*` }]; },
  async headers() { return [{ source: "/:path*", headers: [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
  ] }]; },
};
export default config;
