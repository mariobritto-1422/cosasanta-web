import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SHOW_EUROPA, SHOW_WHATSAPP } from "@/lib/site-flags";
import {
  CAMBIAR_REGION,
  EUROPA_CONTACTO,
  EUROPA_FICHAS,
  EUROPA_PIE,
  EUROPA_WHATSAPP,
  FICHA_ETIQUETAS as E,
  fichaEuropa,
  mailtoEuropa,
} from "@/lib/europa-content";
// Mismo diseño que /europa (fondo, tipografía, cajas)
import europa from "../europa.module.css";
import styles from "./ficha.module.css";

// Solo existen las cuatro fichas; cualquier otra ruta da 404
export const dynamicParams = false;

export function generateStaticParams() {
  return EUROPA_FICHAS.map((f) => ({ ficha: f.slug }));
}

type Props = { params: Promise<{ ficha: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ficha = fichaEuropa((await params).ficha);
  // Mientras Europa esté oculta, la ficha no expone ningún dato propio
  if (!SHOW_EUROPA || !ficha) return {};
  const title = `${ficha.tarjeta} — cosasanta Europa`;
  const url = `https://cosasanta.com/europa/${ficha.slug}`;
  return {
    title,
    description: ficha.entradilla,
    // Sin las palabras clave del layout
    keywords: null,
    robots: "noindex, nofollow",
    openGraph: { url, title, description: ficha.entradilla },
    twitter: { card: "summary", title, description: ficha.entradilla },
  };
}

// **texto** → negrita, *texto* → cursiva (marcas del texto original)
function conFormato(texto: string): ReactNode[] {
  return texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((parte, i) => {
    if (parte.startsWith("**") && parte.endsWith("**")) return <strong key={i}>{parte.slice(2, -2)}</strong>;
    if (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2) return <em key={i}>{parte.slice(1, -1)}</em>;
    return parte;
  });
}

export default async function FichaEuropaPage({ params }: Props) {
  // Mientras SHOW_EUROPA sea false, las fichas no existen (404 real), igual que /europa.
  if (!SHOW_EUROPA) notFound();
  const f = fichaEuropa((await params).ficha);
  if (!f) notFound();

  return (
    <main className={europa.pagina}>
      <div className={europa.fondo} />

      {/* CABECERA */}
      <header className={europa.cabecera}>
        <a href="/europa" className={`logo ${europa.logo}`}>
          cosa<span className="accent">santa</span>
        </a>
        <div role="navigation" aria-label="Navegación" className={europa.menu}>
          <a href="/europa" className={europa.menuEnlace}>
            {E.volver}
          </a>
          <a href={CAMBIAR_REGION.href} className={`${europa.menuEnlace} ${europa.menuRegion}`}>
            {CAMBIAR_REGION.label}
          </a>
        </div>
      </header>

      <article className={styles.ficha}>
        {/* Etiquetas, título y entradilla */}
        <div className={styles.etiquetas}>
          <span className={europa.estado}>{E.aplica}</span>
          <span className={europa.estado}>{f.estado}</span>
        </div>
        <h1 className={styles.titulo}>{f.titulo}</h1>
        <p className={styles.entradilla}>{f.entradilla}</p>

        {/* Para quién es / no es */}
        <div className={styles.par}>
          <section className={europa.bloque}>
            <h2 className={europa.h3}>{E.paraQuienEs}</h2>
            <p>{f.paraQuienEs}</p>
          </section>
          <section className={europa.bloque}>
            <h2 className={europa.h3}>{E.paraQuienNoEs}</h2>
            <p>{f.paraQuienNoEs}</p>
          </section>
        </div>

        {/* Qué hace / Qué no hace */}
        <div className={styles.par}>
          <section className={europa.bloque}>
            <h2 className={europa.h3}>{E.queHace}</h2>
            <ul className={styles.lista}>
              {f.queHace.map((t) => (
                <li key={t}>{conFormato(t)}</li>
              ))}
            </ul>
          </section>
          <section className={europa.bloque}>
            <h2 className={europa.h3}>{E.queNoHace}</h2>
            <p>{conFormato(f.queNoHace)}</p>
          </section>
        </div>

        {/* Cómo funciona */}
        <section className={styles.apartado}>
          <h2 className={styles.h2}>{E.comoFunciona}</h2>
          <ol className={styles.pasos}>
            {f.comoFunciona.map((t, i) => (
              <li key={t}>
                <span className={styles.numero} aria-hidden="true">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.apartado}>
          <h2 className={styles.h2}>{E.queAportar}</h2>
          <p className={styles.texto}>{f.queAportar}</p>
        </section>

        <section className={styles.apartado}>
          <div className={styles.cabezaApartado}>
            <h2 className={styles.h2}>{E.unDia}</h2>
            <span className={europa.estado}>{E.ejemplo}</span>
          </div>
          <div className={europa.franja}>
            <p>{f.unDia}</p>
          </div>
        </section>

        <section className={styles.apartado}>
          <h2 className={styles.h2}>{E.sinEsto}</h2>
          <p className={styles.texto}>{f.sinEsto}</p>
        </section>

        <section className={styles.apartado}>
          <h2 className={styles.h2}>{E.datos}</h2>
          {f.datos.length === 1 ? (
            <p className={styles.texto}>{conFormato(f.datos[0])}</p>
          ) : (
            <ul className={`${styles.lista} ${styles.texto}`}>
              {f.datos.map((t) => (
                <li key={t}>{conFormato(t)}</li>
              ))}
            </ul>
          )}
        </section>

        <div className={styles.acciones}>
          <a href={mailtoEuropa(`Consulta: ${f.tarjeta}`)} className={`btn-primary ${europa.cta}`}>
            {E.consultar}
          </a>
          {SHOW_WHATSAPP && (
            <a
              href={`https://wa.me/${EUROPA_WHATSAPP}`}
              className={europa.botonSecundario}
              target="_blank"
              rel="noopener noreferrer"
            >
              {EUROPA_CONTACTO.botonWhatsapp}
            </a>
          )}
        </div>
      </article>

      {/* PIE */}
      <footer className={europa.pie}>
        <span>{EUROPA_PIE}</span>
        <span className={styles.pieEnlaces}>
          <a href="/europa" className={europa.menuEnlace}>
            {E.volver}
          </a>
          <a href={CAMBIAR_REGION.href} className={europa.menuEnlace}>
            {CAMBIAR_REGION.label}
          </a>
        </span>
      </footer>
    </main>
  );
}
