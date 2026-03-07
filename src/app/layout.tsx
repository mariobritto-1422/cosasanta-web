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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <GoogleTagManager gtmId="GTM-PTJ7RM9V" />
      <body className={`${plusJakarta.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
