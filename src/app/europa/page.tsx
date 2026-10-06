import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHOW_EUROPA, SHOW_WHATSAPP } from "@/lib/site-flags";
import {
  CAMBIAR_REGION,
  CTA_CONVERSACION,
  EUROPA_CONTACTO,
  EUROPA_DIAGNOSTICO,
  EUROPA_EMAIL,
  EUROPA_EMAIL_ASUNTO,
  EUROPA_HERO,
  EUROPA_META,
  EUROPA_NAV,
  EUROPA_PIE,
  EUROPA_SERVICIOS,
  EUROPA_WHATSAPP,
} from "@/lib/europa-content";
import styles from "./europa.module.css";

export const metadata: Metadata = {
  title: EUROPA_META.title,
  description: EUROPA_META.description,
  // Sin las palabras clave del layout (orientadas a Argentina)
  keywords: null,
  robots: "noindex, nofollow",
  openGraph: {
    url: EUROPA_META.url,
    title: EUROPA_META.title,
    description: EUROPA_META.description,
  },
  twitter: {
    card: "summary",
    title: EUROPA_META.title,
    description: EUROPA_META.description,
  },
};

const MAILTO = `mailto:${EUROPA_EMAIL}?subject=${encodeURIComponent(EUROPA_EMAIL_ASUNTO)}`;

export default function Europa() {
  // Mientras SHOW_EUROPA sea false, la ruta no existe (404 real).
  if (!SHOW_EUROPA) notFound();

  const d = EUROPA_DIAGNOSTICO;

  return (
    <main className={styles.pagina}>
      <div className={styles.fondo} />

      {/* CABECERA */}
      <header className={styles.cabecera}>
        <a href="/europa" className={`logo ${styles.logo}`}>
          cosa<span className="accent">santa</span>
        </a>
        <div role="navigation" aria-label="Secciones" className={styles.menu}>
          {EUROPA_NAV.map((l) => (
            <a key={l.href} href={l.href} className={styles.menuEnlace}>
              {l.label}
            </a>
          ))}
          <a href={CAMBIAR_REGION.href} className={`${styles.menuEnlace} ${styles.menuRegion}`}>
            {CAMBIAR_REGION.label}
          </a>
        </div>
      </header>

      {/* PORTADA */}
      <section className={styles.portada}>
        <h1 className={styles.titulo}>{EUROPA_HERO.titulo}</h1>
        <p className={styles.subtitulo}>{EUROPA_HERO.subtitulo}</p>
        <a href={CTA_CONVERSACION.href} className={`btn-primary ${styles.cta}`}>
          {CTA_CONVERSACION.label}
        </a>
      </section>

      {/* DIAGNÓSTICO */}
      <section id="diagnostico" className={styles.seccion}>
        <h2 className={styles.h2}>{d.titulo}</h2>
        <p className={styles.intro}>{d.intro}</p>

        <div className={styles.pasos}>
          <article className={styles.bloque}>
            <h3 className={styles.h3}>{d.paso1.titulo}</h3>
            <p>{d.paso1.texto}</p>
          </article>
          <article className={styles.bloque}>
            <h3 className={styles.h3}>{d.paso2.titulo}</h3>
            <p>{d.paso2.intro}</p>
            <ol className={styles.lista}>
              {d.paso2.bloques.map((b) => (
                <li key={b.titulo}>
                  <strong>{b.titulo}</strong> {b.texto}
                </li>
              ))}
            </ol>
            <p>{d.paso2.cierre}</p>
          </article>
        </div>

        <div className={styles.franja}>
          <p>
            <strong>{d.precio.titulo}</strong> {d.precio.texto}
          </p>
        </div>

        <p className={styles.cierre}>{d.cierre}</p>
        <a href={CTA_CONVERSACION.href} className={`btn-primary ${styles.cta}`}>
          {CTA_CONVERSACION.label}
        </a>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className={styles.seccion}>
        <h2 className={styles.h2}>{EUROPA_SERVICIOS.titulo}</h2>
        <p className={styles.intro}>{EUROPA_SERVICIOS.subtitulo}</p>

        <div className={styles.tarjetas}>
          {EUROPA_SERVICIOS.tarjetas.map((t) => (
            // Toda la tarjeta enlaza a su ficha
            <a key={t.nombre} href={t.href} className={`${styles.tarjeta} ${styles.tarjetaEnlace}`}>
              <div className={styles.tarjetaCabeza}>
                <span className={styles.tarjetaNombre}>{t.nombre}</span>
                <span className={styles.estado}>{t.estado}</span>
              </div>
              <h3 className={styles.h3}>{t.titular}</h3>
              <p>{t.frase}</p>
              {t.pie && <p className={styles.tarjetaPie}>{t.pie}</p>}
            </a>
          ))}
        </div>

        <p className={styles.nota}>{EUROPA_SERVICIOS.leyenda}</p>
        <p className={styles.nota}>{EUROPA_SERVICIOS.datos}</p>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className={`${styles.seccion} ${styles.contacto}`}>
        <h2 className={styles.h2}>{EUROPA_CONTACTO.titulo}</h2>
        <p className={styles.intro}>{EUROPA_CONTACTO.texto}</p>
        <div className={styles.contactoAcciones}>
          <a href={MAILTO} className={`btn-primary ${styles.cta}`}>
            {EUROPA_CONTACTO.botonCorreo}
          </a>
          {SHOW_WHATSAPP && (
            <a
              href={`https://wa.me/${EUROPA_WHATSAPP}`}
              className={styles.botonSecundario}
              target="_blank"
              rel="noopener noreferrer"
            >
              {EUROPA_CONTACTO.botonWhatsapp}
            </a>
          )}
        </div>
        <a href={MAILTO} className={styles.correo}>
          {EUROPA_EMAIL}
        </a>
      </section>

      {/* PIE */}
      <footer className={styles.pie}>
        <span>{EUROPA_PIE}</span>
        <a href={CAMBIAR_REGION.href} className={styles.menuEnlace}>
          {CAMBIAR_REGION.label}
        </a>
      </footer>
    </main>
  );
}
