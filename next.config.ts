import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // v2: Public safety moved to /safety. Keep old links working.
  async redirects() {
    return [
      { source: "/public-safety", destination: "/safety", permanent: true },
      { source: "/public-safety/:guide", destination: "/safety/guides/:guide", permanent: true },
    ];
  },
  // The demo must never be indexed: it carries fictional stories.
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
