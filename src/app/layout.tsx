import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "CosaSanta — Páginas Web, Marketing Digital y Automatización con IA | Argentina & Latam",
  description:
    "Desarrollamos páginas web, landing pages, bots de WhatsApp y sistemas de gestión para clínicas, consultorios, salones de belleza y empresas de Argentina, Buenos Aires y Misiones. Marketing digital, SEO y merchandising empresarial con IA.",
  keywords:
    "página web profesional Argentina, diseño web pymes Buenos Aires, sistema de turnos consultorios Argentina, bot WhatsApp para negocios, marketing digital Misiones, landing page Argentina, automatización WhatsApp clínicas, merchandising empresarial Argentina, agenda digital psicólogos Argentina, sistema gestión odontología, diseño web Misiones, agencia digital NEA Argentina",
  openGraph: {
    url: "https://cosasanta.com",
  },
  robots: "index, follow",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Cosa Santa",
  "url": "https://cosasanta.com",
  "description": "Agencia de automatización con IA, desarrollo web y marketing digital para empresas de Argentina y Latam.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Posadas",
    "addressRegion": "Misiones",
    "addressCountry": "AR"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Spanish",
    "url": "https://wa.me/543764745849"
  },
  "sameAs": [
    "https://www.instagram.com/cosa_santa/",
    "https://www.facebook.com/rollercomercial/",
    "https://www.linkedin.com/in/mariobritto"
  ]
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Cosa Santa",
  "url": "https://cosasanta.com",
  "description": "Páginas web, bots de WhatsApp con IA, sistemas de gestión y marketing digital para clínicas, consultorios, salones de belleza y empresas de Argentina.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Posadas",
    "addressRegion": "Misiones",
    "addressCountry": "AR"
  },
  "areaServed": ["Buenos Aires", "Misiones", "Argentina", "Latam"],
  "priceRange": "$"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <GoogleTagManager gtmId="GTM-PTJ7RM9V" />
      <body className={`${plusJakarta.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
