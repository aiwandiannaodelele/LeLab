import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig