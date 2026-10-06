import type { Metadata } from "next";
import { SHOW_EUROPA } from "@/lib/site-flags";
import styles from "./portal.module.css";

const DESCRIPCION =
  "cosasanta: tecnología e inteligencia artificial para pymes. Automatización con IA, marketing digital y merchandising empresarial.";

// Página de prueba privada: fuera del sitemap, sin enlaces desde el sitio
// y oculta a Google.
export const metadata: Metadata = {
  title: "cosasanta — Tecnología e inteligencia artificial para hacer crecer tu negocio",
  description: DESCRIPCION,
  robots: "noindex, nofollow",
  openGraph: {
    url: "https://cosasanta.com/portal",
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary",
    description: DESCRIPCION,
  },
};

const SERVICIOS = ["Automatización con IA", "Marketing digital", "Merchandising empresarial"];

export default function Portal() {
  return (
    <main className={styles.portal}>
      <div className={styles.fondo} />
      <div className={styles.contenido}>
        <h1 className={`logo ${styles.marcaPortal}`}>
          cosa<span className="accent">santa</span>
        </h1>
        <p className={styles.frase}>
          Tecnología e inteligencia artificial para hacer crecer tu negocio.
        </p>
        <ul className={styles.servicios}>
          {SERVICIOS.map((s, i) => (
            <li key={s}>
              {i > 0 && <span className={styles.separador} aria-hidden="true">·</span>}
              {s}
            </li>
          ))}
        </ul>

        {/* Selector de región: lo elige el visitante, sin detección ni redirecciones */}
        <div role="group" className={styles.region} aria-labelledby="region-titulo">
          <p id="region-titulo" className={styles.regionTitulo}>
            Selecciona tu región
          </p>
          <div className={styles.botones}>
            <a href="/latam" className={styles.boton}>
              Latam
            </a>
            {SHOW_EUROPA ? (
              <a href="/europa" className={styles.boton}>
                Europa
              </a>
            ) : (
              <span
                role="link"
                aria-disabled="true"
                className={`${styles.boton} ${styles.botonInactivo}`}
              >
                Europa
                <span className={styles.proximamente}>Próximamente</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
