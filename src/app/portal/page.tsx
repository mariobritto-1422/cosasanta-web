import type { Metadata } from "next";
import { SHOW_EUROPA } from "@/lib/site-flags";
import styles from "./portal.module.css";

// Página de prueba privada: fuera del sitemap, sin enlaces desde el sitio
// y oculta a Google.
export const metadata: Metadata = {
  title: "cosasanta — Tecnología e inteligencia artificial para hacer crecer tu negocio",
  robots: "noindex, nofollow",
  openGraph: {
    url: "https://cosasanta.com/portal",
  },
};

export default function Portal() {
  const europaBody = (
    <>
      <h2 className={styles.cardTitulo}>Europa</h2>
      <p className={styles.cardTexto}>
        Automatización e inteligencia artificial para pymes europeas.
      </p>
      <div className={styles.cardPie}>
        {SHOW_EUROPA ? (
          <span className={styles.entrar}>Entrar →</span>
        ) : (
          <span className={styles.proximamente}>Próximamente</span>
        )}
      </div>
    </>
  );

  return (
    <main className={styles.portal}>
      <div className={styles.fondo} />
      <div className={styles.contenido}>
        <div className={`logo ${styles.marca}`}>
          cosa<span className="accent">santa</span>
        </div>
        <p className={styles.frase}>
          Tecnología e inteligencia artificial para hacer crecer tu negocio.
        </p>

        <div className={styles.puertas}>
          <a href="/latam" className={`${styles.card} ${styles.cardLink}`}>
            <h2 className={styles.cardTitulo}>Latam</h2>
            <p className={styles.cardTexto}>
              Páginas web, automatización y marketing para negocios de Argentina
              y Latinoamérica.
            </p>
            <div className={styles.cardPie}>
              <span className={styles.entrar}>Entrar →</span>
            </div>
          </a>

          {SHOW_EUROPA ? (
            <a href="/europa" className={`${styles.card} ${styles.cardLink}`}>
              {europaBody}
            </a>
          ) : (
            <div className={`${styles.card} ${styles.cardInactiva}`}>
              {europaBody}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
