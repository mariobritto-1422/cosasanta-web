import AgenteContenido from "@/components/AgenteContenido";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoPost — Generador de Contenido con IA | cosa$anta",
  description:
    "Generá un mes completo de publicaciones para tus redes sociales en 2 minutos con inteligencia artificial. Gratis.",
};

export default function AutoPostPage() {
  return <AgenteContenido />;
}
