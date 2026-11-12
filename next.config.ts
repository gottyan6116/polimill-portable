import type { NextConfig } from "next";

// GitHub Pages では /polimill-portable 配下に置かれるため、ビルド時だけ basePath を付ける
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: { root: __dirname },
};

export default nextConfig;
