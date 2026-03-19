import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export"  ← eliminado para habilitar rutas API y SSR
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        // Redirect 301: /blog?post=slug → /blog/slug
        // Preserva cualquier indexación previa de URLs con query params
        source: "/blog",
        has: [{ type: "query", key: "post", value: "(?<post>.*)" }],
        destination: "/blog/:post",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
