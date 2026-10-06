import type { Metadata } from "next";
import HomeLatam from "@/components/HomeLatam";

// Misma portada que "/", con el logo apuntando a /latam.
// Oculta a Google por ahora (sin canonical a otra página y fuera del sitemap).
export const metadata: Metadata = {
  robots: "noindex, nofollow",
  openGraph: {
    url: "https://cosasanta.com/latam",
  },
};

export default function Latam() {
  return <HomeLatam logoHref="/latam" />;
}
