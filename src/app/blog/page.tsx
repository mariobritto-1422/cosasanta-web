import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    month: "short",
    year: "numeric",
  });
}

const WA_NUMBER = "5492945415186";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string }>;
}) {
  const { post } = await searchParams;
  if (post) {
    permanentRedirect(`/blog/${post}`);
  }

  let posts: BlogPost[] = [];
  try {
    const { data } = await createClient(supabaseUrl, supabaseAnonKey)
      .from("blog_posts")
      .select("id, titulo, slug, resumen, categoria, created_at")
      .eq("publicado", true)
      .order("created_at", { ascending: false });
    posts = data || [];
  } catch {
    // tabla puede no existir aún
  }

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

      <section style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="section-tag">Novedades IA</div>
          <h2 style={{ marginBottom: "12px" }}>
            Lo último en
            <br />
            Claude &amp; IA.
          </h2>
          <p className="section-sub">
            Automatización, desarrollo SaaS y tendencias de IA para empresas de
            Argentina y Latam.
          </p>

          {posts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--muted)",
              }}
            >
              <p style={{ fontSize: "48px", marginBottom: "16px" }}>📝</p>
              <p>Próximamente nuevos artículos.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="blog-card" style={{ cursor: "pointer" }}>
                    <div className="blog-img">
                      {EMOJI_MAP[post.categoria] || "📝"}
                    </div>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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
