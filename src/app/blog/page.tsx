"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const WA_NUMBER = "5492945415186";

interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
  contenido: string | null;
  categoria: string;
  created_at: string;
}

const EMOJI_MAP: Record<string, string> = {
  "Claude AI": "🧠",
  "Automatización": "⚡",
  "Healthcare Tech": "🏥",
  "SaaS": "💻",
  "WhatsApp": "💬",
  "n8n": "⚡",
};

function formatDate(dateStr: string, long = false): string {
  return new Date(dateStr).toLocaleDateString("es-AR", long
    ? { day: "numeric", month: "long", year: "numeric" }
    : { month: "short", year: "numeric" }
  );
}

function Nav() {
  return (
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
  );
}

function Footer() {
  return (
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
  );
}

function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postSlug = searchParams.get("post");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Load post list
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("id, titulo, slug, resumen, contenido, categoria, created_at")
          .eq("publicado", true)
          .order("created_at", { ascending: false });
        setPosts(data || []);
      } catch {
        // table may not exist yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Resolve current post from slug
  useEffect(() => {
    if (!postSlug || posts.length === 0) {
      setCurrentPost(null);
      return;
    }
    const found = posts.find((p) => p.slug === postSlug) || null;
    setCurrentPost(found);
  }, [postSlug, posts]);

  // ── SINGLE POST VIEW ────────────────────────────────────────────
  if (postSlug) {
    if (loading) {
      return (
        <section style={{ paddingTop: "120px", minHeight: "100vh", textAlign: "center", color: "var(--muted)" }}>
          Cargando artículo…
        </section>
      );
    }

    if (!currentPost) {
      return (
        <section style={{ paddingTop: "120px", minHeight: "100vh", textAlign: "center" }}>
          <p style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</p>
          <p style={{ color: "var(--muted)" }}>Artículo no encontrado.</p>
          <button
            onClick={() => router.push("/blog")}
            className="btn-secondary"
            style={{ marginTop: "32px", cursor: "pointer", background: "none", border: "1px solid var(--border)" }}
          >
            ← Volver al blog
          </button>
        </section>
      );
    }

    return (
      <article style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 48px 96px" }}>
          <button
            onClick={() => router.push("/blog")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "48px",
              padding: 0,
            }}
          >
            ← Volver al blog
          </button>

          <div className="blog-cat" style={{ marginBottom: "16px" }}>{currentPost.categoria}</div>
          <h1
            style={{
              fontFamily: "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {currentPost.titulo}
          </h1>

          {currentPost.resumen && (
            <p style={{ fontSize: "18px", color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px", fontWeight: 300 }}>
              {currentPost.resumen}
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
            {formatDate(currentPost.created_at, true)}
          </div>

          {currentPost.contenido ? (
            <div
              style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--text)" }}
              dangerouslySetInnerHTML={{ __html: currentPost.contenido }}
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

          <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
            <button
              onClick={() => router.push("/blog")}
              className="btn-secondary"
              style={{ cursor: "pointer", background: "none" }}
            >
              ← Ver todos los artículos
            </button>
          </div>
        </div>
      </article>
    );
  }

  // ── POST LIST VIEW ───────────────────────────────────────────────
  return (
    <section style={{ paddingTop: "120px", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="section-tag">Novedades IA</div>
        <h2 style={{ marginBottom: "12px" }}>
          Lo último en
          <br />
          Claude &amp; IA.
        </h2>
        <p className="section-sub">
          Automatización, desarrollo SaaS y tendencias de IA para empresas de Argentina y Latam.
        </p>

        {loading && (
          <p style={{ color: "var(--muted)", textAlign: "center", padding: "60px 0" }}>Cargando artículos…</p>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📝</p>
            <p>Próximamente nuevos artículos.</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="blog-grid">
            {posts.map((post) => (
              <div
                key={post.id}
                className="blog-card"
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/blog?post=${post.slug}`)}
              >
                <div className="blog-img">{EMOJI_MAP[post.categoria] || "📝"}</div>
                <div className="blog-body">
                  <div className="blog-cat">{post.categoria}</div>
                  <h3>{post.titulo}</h3>
                  {post.resumen && <p>{post.resumen}</p>}
                  <div className="blog-footer">
                    <span>{formatDate(post.created_at)}</span>
                    <span>→ Leer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function BlogPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={
        <section style={{ paddingTop: "120px", minHeight: "100vh", textAlign: "center", color: "var(--muted)" }}>
          Cargando…
        </section>
      }>
        <BlogContent />
      </Suspense>
      <Footer />
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
