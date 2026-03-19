import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600; // ISR: re-renderiza cada hora
export const dynamicParams = true; // slugs nuevos de N8N se renderizan SSR automáticamente

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
  contenido: string | null;
  categoria: string;
  created_at: string;
}

function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Pre-renderiza todos los slugs publicados al momento del build.
// Los artículos nuevos de N8N se renderizan SSR en la primera visita
// y quedan cacheados automáticamente (dynamicParams = true por defecto).
export async function generateStaticParams() {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("slug")
    .eq("publicado", true);
  return (data || []).map((post: { slug: string }) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getSupabase()
    .from("blog_posts")
    .select("titulo, resumen, created_at")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (!post) {
    return { title: "Artículo no encontrado — CosaSanta" };
  }

  return {
    title: `${post.titulo} — CosaSanta`,
    description: post.resumen || undefined,
    alternates: {
      canonical: `https://cosasanta.com/blog/${slug}`,
    },
    openGraph: {
      title: post.titulo,
      description: post.resumen || undefined,
      url: `https://cosasanta.com/blog/${slug}`,
      type: "article",
      publishedTime: post.created_at,
      siteName: "CosaSanta",
    },
    robots: "index, follow",
  };
}

const WA_NUMBER = "5492945415186";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await getSupabase()
    .from("blog_posts")
    .select("id, titulo, slug, resumen, contenido, categoria, created_at")
    .eq("slug", slug)
    .eq("publicado", true)
    .single<BlogPost>();

  const schema = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.titulo,
        description: post.resumen || undefined,
        datePublished: post.created_at,
        dateModified: post.created_at,
        author: {
          "@type": "Organization",
          name: "CosaSanta",
          url: "https://cosasanta.com",
        },
        publisher: {
          "@type": "Organization",
          name: "CosaSanta",
          url: "https://cosasanta.com",
        },
        url: `https://cosasanta.com/blog/${slug}`,
        mainEntityOfPage: `https://cosasanta.com/blog/${slug}`,
        articleSection: post.categoria,
        inLanguage: "es-AR",
      }
    : null;

  return (
    <>
      <nav>
        <Link href="/" className="logo">
          cosa<span className="accent">santa</span>
          <span className="muted">.ai</span>
        </Link>
        <ul>
          <li><a href="/#servicios">Servicios</a></li>
          <li><a href="/#proyectos">Proyectos</a></li>
          <li><a href="/#proceso">Proceso</a></li>
          <li><Link href="/blog" style={{ color: "var(--text)" }}>Blog</Link></li>
          <li><a href="/#contacto" className="nav-cta">Hablemos →</a></li>
        </ul>
      </nav>

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {!post ? (
        <section
          style={{
            paddingTop: "120px",
            minHeight: "100vh",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</p>
          <p style={{ color: "var(--muted)" }}>Artículo no encontrado.</p>
          <Link
            href="/blog"
            className="btn-secondary"
            style={{ marginTop: "32px", display: "inline-block" }}
          >
            ← Volver al blog
          </Link>
        </section>
      ) : (
        <article style={{ paddingTop: "120px", minHeight: "100vh" }}>
          <div
            style={{ maxWidth: "780px", margin: "0 auto", padding: "0 48px 96px" }}
          >
            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--muted)",
                fontSize: "14px",
                marginBottom: "48px",
                textDecoration: "none",
              }}
            >
              ← Volver al blog
            </Link>

            <div className="blog-cat" style={{ marginBottom: "16px" }}>
              {post.categoria}
            </div>

            <h1
              style={{
                fontFamily:
                  "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                letterSpacing: "-1px",
                lineHeight: 1.1,
                marginBottom: "20px",
              }}
            >
              {post.titulo}
            </h1>

            {post.resumen && (
              <p
                style={{
                  fontSize: "18px",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                  fontWeight: 300,
                }}
              >
                {post.resumen}
              </p>
            )}

            <div
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                marginBottom: "56px",
                paddingBottom: "32px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {formatDate(post.created_at)}
            </div>

            {post.contenido ? (
              <div
                style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--text)" }}
                dangerouslySetInnerHTML={{ __html: post.contenido }}
              />
            ) : (
              <div
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "48px",
                  textAlign: "center",
                  color: "var(--muted)",
                }}
              >
                <p style={{ fontSize: "40px", marginBottom: "16px" }}>🚧</p>
                <p>Contenido completo próximamente.</p>
              </div>
            )}

            <div
              style={{
                marginTop: "64px",
                paddingTop: "32px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <Link
                href="/blog"
                className="btn-secondary"
                style={{ display: "inline-block" }}
              >
                ← Ver todos los artículos
              </Link>
            </div>
          </div>
        </article>
      )}

      <footer>
        <Link href="/" className="logo">
          cosa<span className="accent">santa</span>
          <span className="muted">.ai</span>
        </Link>
        <div className="footer-links">
          <a href="/#servicios">Servicios</a>
          <a href="/#proyectos">Proyectos</a>
          <Link href="/blog">Blog</Link>
          <a href="/#contacto">Contacto</a>
        </div>
        <div className="footer-copy">
          © 2026 CosaSanta · Argentina &amp; Latam · hecho en Misiones
        </div>
      </footer>

      <a
        href={`https://wa.me/${WA_NUMBER}`}
        className="wa-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        💬
      </a>
    </>
  );
}
