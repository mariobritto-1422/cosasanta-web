import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SHOW_EUROPA } from "@/lib/site-flags";
import styles from "../portal/portal.module.css";

export const metadata: Metadata = {
  title: "Europa — en preparación | cosasanta",
  robots: "noindex, nofollow",
  openGraph: {
    url: "https://cosasanta.com/europa",
  },
};

export default function Europa() {
  // Mientras SHOW_EUROPA sea false, la ruta no existe (404 real).
  if (!SHOW_EUROPA) notFound();

  return (
    <main className={styles.portal}>
      <a href="/" className={`logo ${styles.marca}`}>
        cosa<span className="accent">santa</span>
      </a>
      <h1 className={styles.titulo}>Europa — en preparación</h1>
    </main>
  );
}
