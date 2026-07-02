import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Lejo çdo host imazhi HTTPS — admini mund të ngjisë URL arbitrare recetash.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
