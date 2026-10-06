"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Datos estructurados (JSON-LD) de cosasanta Argentina y Latam.
// Se muestran en todo el sitio salvo en las rutas de otras regiones
// (/portal y /europa, incluidas sus subrutas y su 404), para no mezclar
// datos de Argentina en esas páginas. El contenido está en JsonLdLatam y se
// carga aparte: en /portal y /europa ni siquiera se descarga.
const RUTAS_SIN_DATOS_LATAM = ["/portal", "/europa"];

const JsonLdLatam = dynamic(() => import("./JsonLdLatam"));

export default function DatosEstructuradosLatam() {
  const pathname = usePathname() || "/";
  const otraRegion = RUTAS_SIN_DATOS_LATAM.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
  if (otraRegion) return null;

  return <JsonLdLatam />;
}
