import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export"  ← eliminado para habilitar rutas API y SSR
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
