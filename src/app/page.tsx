"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  resumen: string | null;
  categoria: string;
  created_at: string;
}

const HARDCODED_POSTS = [
  {
    id: "1",
    emoji: "📅",
    categoria: "Salud Digital",
    titulo: "Cómo automatizar los turnos de tu consultorio con WhatsApp en Argentina",
    resumen: "Guía práctica para odontólogos, psicólogos y kinesiólogos que quieren reducir ausencias y ahorrar tiempo con recordatorios automáticos.",
    fecha: "Mar 2026",
    slug: null,
  },
  {
    id: "2",
    emoji: "💰",
    categoria: "Diseño Web",
    titulo: "Cuánto cuesta una página web profesional en Argentina en 2026",
    resumen: "Precios reales, qué incluye cada plan y cómo elegir la mejor opción para tu negocio o consultorio.",
    fecha: "Feb 2026",
    slug: null,
  },
  {
    id: "3",
    emoji: "📣",
    categoria: "Marketing Digital",
    titulo: "Marketing digital para pymes en Misiones: por dónde empezar",
    resumen: "Estrategias concretas para negocios locales que quieren aparecer en Google y atraer clientes sin gastar fortunas en publicidad.",
    fecha: "Ene 2026",
    slug: null,
  },
];

const WA_NUMBER = "5492945415186";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Hola%20CosaSanta%2C%20quiero%20saber%20m%C3%A1s%20sobre%20sus%20servicios`;
const EMAIL = "hola@cosasanta.ai";

const EMOJI_MAP: Record<string, string> = {
  "Claude AI": "🧠",
  "Automatización": "⚡",
  "Healthcare Tech": "🏥",
  "SaaS": "💻",
  "WhatsApp": "💬",
  "n8n": "⚡",
  "Salud Digital": "📅",
  "Diseño Web": "💰",
  "Marketing Digital": "📣",
};

function formatFecha(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", { month: "short", year: "numeric" });
}

export default function Home() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, titulo, slug, resumen, categoria, created_at")
      .eq("publicado", true)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data && data.length > 0) setBlogPosts(data);
      });
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="/" className="logo">
          cosa<span className="accent">santa</span>
          <span className="muted">.ai</span>
        </a>
        <ul>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#proyectos">Proyectos</a></li>
          <li><a href="#proceso">Proceso</a></li>
          <li><a href="#blog">Blog</a></li>
          <li><a href="#contacto" className="nav-cta">Hablemos →</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-tag">IA aplicada · Argentina & Latam</div>
          <h1>
            Hacemos crecer tu negocio con tecnología e inteligencia artificial.
          </h1>
          <p className="hero-sub">
            Páginas web, bots de WhatsApp, sistemas de gestión y marketing digital
            para clínicas, consultorios, salones de belleza y empresas de{" "}
            <strong>Buenos Aires, Misiones y toda Argentina.</strong>
          </p>
          <div className="hero-actions">
            <a href="#contacto" className="btn-primary">
              Quiero automatizar mi negocio →
            </a>
            <a href="#proyectos" className="btn-secondary">
              Ver proyectos
            </a>
          </div>
        </div>
        <div className="stats reveal">
          <div className="stat">
            <div className="stat-num">11+</div>
            <div className="stat-label">Proyectos desarrollados</div>
          </div>
          <div className="stat" style={{ paddingLeft: "48px" }}>
            <div className="stat-num">3</div>
            <div className="stat-label">SaaS en producción</div>
          </div>
          <div className="stat" style={{ paddingLeft: "48px" }}>
            <div className="stat-num">100%</div>
            <div className="stat-label">IA integrada en cada solución</div>
          </div>
          <div className="stat" style={{ paddingLeft: "48px" }}>
            <div className="stat-num">24/7</div>
            <div className="stat-label">Automatización activa</div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="servicios" id="servicios">
        <div className="section-tag reveal">Lo que hacemos</div>
        <h2 className="reveal">
          Soluciones que
          <br />
          generan resultado.
        </h2>
        <p className="section-sub reveal">
          No vendemos tecnología. Vendemos tiempo recuperado, clientes atendidos
          y procesos que funcionan solos.
        </p>
        <div className="services-grid reveal">
          <div className="service-card">
            <div className="service-icon">🌐</div>
            <h3>Páginas Web y Landing Pages ⭐</h3>
            <p>
              Diseñamos y desarrollamos tu presencia digital desde cero.
              Páginas web profesionales, landing pages que convierten y tiendas
              online para pymes, profesionales y empresas de Argentina y Latam.
              Rápidas, modernas y optimizadas para Google.
            </p>
            <span className="service-tag">→ Diseño Web · Landing Pages · SEO incluido</span>
          </div>
          <div className="service-card">
            <div className="service-icon">💬</div>
            <h3>Automatización WhatsApp con IA</h3>
            <p>
              Tu negocio responde solo, las 24 horas. Bots inteligentes para
              consultorios, clínicas, salones de belleza, casas de comida y
              cualquier negocio que quiera atender clientes sin estar pendiente
              del celular. Implementado en Buenos Aires, Misiones y todo el país.
            </p>
            <span className="service-tag">→ WhatsApp · Claude AI · Atención 24/7</span>
          </div>
          <div className="service-card">
            <div className="service-icon">🏥</div>
            <h3>Sistemas para Salud</h3>
            <p>
              Sistemas de turnos y gestión para odontólogos, psicólogos,
              kinesiólogos, clínicas y sanatorios. Recordatorios automáticos
              por WhatsApp, agenda digital y gestión de guardias.
              Diseñado para la realidad de la salud en Argentina.
            </p>
            <span className="service-tag">→ Odontología · Clínicas · Sanatorios</span>
          </div>
          <div className="service-card">
            <div className="service-icon">📈</div>
            <h3>Marketing Digital</h3>
            <p>
              SEO, redes sociales, contenido estratégico y campañas digitales
              para que tus clientes te encuentren en Google. Estrategias de
              marketing para pymes y profesionales de Buenos Aires, Misiones
              y toda Argentina. Medimos resultados, no likes.
            </p>
            <span className="service-tag">→ SEO · Redes Sociales · Google Ads</span>
          </div>
          <div className="service-card">
            <div className="service-icon">🏪</div>
            <h3>Comercios y Empresas</h3>
            <p>
              Sistemas de gestión para agencias de autos de alta gama, salones
              de belleza, servicios técnicos y miniemprendimientos.
              Automatización de turnos, catálogos digitales y comunicación
              con clientes por WhatsApp. Para negocios de todo el país.
            </p>
            <span className="service-tag">→ Autos · Belleza · Emprendimientos</span>
          </div>
          <div className="service-card">
            <div className="service-icon">👕</div>
            <h3>Merchandising Empresarial</h3>
            <p>
              Diseño y producción de materiales de marca para empresas y
              comercios. Desde uniformes con identidad visual hasta packaging,
              etiquetas y artículos promocionales. Dale presencia física a tu
              marca en Misiones y Argentina.
            </p>
            <span className="service-tag">→ Branding · Etiquetas · Artículos Promocionales</span>
          </div>
        </div>
      </section>

      {/* PROYECTOS */}
      <section id="proyectos" style={{ padding: "96px 48px" }}>
        <div className="proyectos-header reveal">
          <div>
            <div className="section-tag">Proyectos reales</div>
            <h2>Lo que construimos.</h2>
          </div>
          <a href="#contacto" className="btn-secondary">
            Ver todos →
          </a>
        </div>
        <p className="section-sub reveal" style={{ marginBottom: "48px" }}>
          Soluciones desarrolladas para clínicas dentales, sanatorios,
          salones de belleza y agencias automotrices en Argentina y Latam.
        </p>
        <div className="proyectos-grid reveal">
          <div className="project-card">
            <div className="project-sector">Healthcare · SaaS</div>
            <h3>SonrisApp</h3>
            <p>
              Sistema de gestión para consultorios odontológicos. Suscripciones,
              turnos, facturación y autenticación profesional. Tres planes desde
              $9 USD/mes.
            </p>
            <div className="project-footer">
              <div className="project-status">
                <div className="dot" />
                En desarrollo activo
              </div>
              <div className="project-arrow">→</div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-sector">Healthcare · SaaS</div>
            <h3>SANATURNO</h3>
            <p>
              Ecosistema digital para sanatorios psiquiátricos. Gestión de
              guardias, banco de horas, check-in QR y notificaciones WhatsApp
              automáticas.
            </p>
            <div className="project-footer">
              <div className="project-status">
                <div className="dot dot-orange" />
                Ready para deploy
              </div>
              <div className="project-arrow">→</div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-sector">Belleza · SaaS</div>
            <h3>Topaciobot</h3>
            <p>
              Sistema de gestión para salones de belleza. Agenda visual, gestión
              de empleados, catálogo de servicios y dashboard de comisiones. PWA
              instalable en cualquier dispositivo.
            </p>
            <div className="project-footer">
              <div className="project-status">
                <div className="dot" />
                Deployado en producción
              </div>
              <div className="project-arrow">→</div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-sector">Automotriz · SaaS</div>
            <h3>TrakNine</h3>
            <p>
              Plataforma SaaS para agencias de vehículos de alta gama. Gestión de
              stock, clientes y comunicación automatizada. Deploy en traknine.com.
            </p>
            <div className="project-footer">
              <div className="project-status">
                <div className="dot dot-blue" />
                Propuesta lista
              </div>
              <div className="project-arrow">→</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="proceso" id="proceso">
        <div className="section-tag reveal">Cómo trabajamos</div>
        <h2 className="reveal">
          Simple. Rápido.
          <br />
          Sin vueltas.
        </h2>
        <p className="section-sub reveal">
          De la idea al producto funcionando en semanas, no meses.
        </p>
        <div className="proceso-steps reveal">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Diagnóstico</h3>
            <p>
              Entendemos tu negocio, tus procesos actuales y dónde la IA puede
              generar el mayor impacto real.
            </p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Propuesta</h3>
            <p>
              Diseñamos la solución, el stack tecnológico y el modelo de inversión.
              Todo documentado y claro.
            </p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Desarrollo</h3>
            <p>
              Construimos con Claude Code — rápido, limpio y escalable. Vos ves el
              avance en tiempo real.
            </p>
          </div>
          <div className="step">
            <div className="step-num">04</div>
            <h3>Deploy + Soporte</h3>
            <p>
              Lanzamos, capacitamos y acompañamos. El sistema trabaja solo,
              nosotros monitoreamos.
            </p>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" style={{ padding: "96px 48px" }}>
        <div className="proyectos-header reveal">
          <div>
            <div className="section-tag">Novedades IA</div>
            <h2>
              Lo último en
              <br />
              Claude & IA.
            </h2>
          </div>
          <a href="/blog" className="btn-secondary">
            Ver todos →
          </a>
        </div>
        <div className="blog-grid reveal">
          {blogPosts.length > 0
            ? blogPosts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog?post=${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="blog-card" style={{ cursor: "pointer", height: "100%" }}>
                    <div className="blog-img">{EMOJI_MAP[post.categoria] || "📝"}</div>
                    <div className="blog-body">
                      <div className="blog-cat">{post.categoria}</div>
                      <h3>{post.titulo}</h3>
                      {post.resumen && <p>{post.resumen}</p>}
                      <div className="blog-footer">
                        <span>{formatFecha(post.created_at)}</span>
                        <span>→ Leer</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            : HARDCODED_POSTS.map((post) => (
                <div key={post.id} className="blog-card">
                  <div className="blog-img">{post.emoji}</div>
                  <div className="blog-body">
                    <div className="blog-cat">{post.categoria}</div>
                    <h3>{post.titulo}</h3>
                    <p>{post.resumen}</p>
                    <div className="blog-footer">
                      <span>{post.fecha}</span>
                      <span>→ Leer</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section" id="contacto">
        <div className="cta-bg" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="section-tag reveal">¿Hablamos?</div>
          <h2 className="reveal">
            ¿Querés hacer crecer tu negocio?
          </h2>
          <p className="section-sub reveal">
            Diseñamos tu página web, automatizamos tu WhatsApp y te ayudamos
            a aparecer en Google. Para consultorios, clínicas, comercios y
            empresas de Buenos Aires, Misiones y toda Argentina.
            Sin compromiso — respondemos en menos de 24hs.
          </p>

          <div className="reveal" style={{ textAlign: "center", margin: "40px 0" }}>
            <a
              href="https://cosa-santa-n8n.6nfych.easypanel.host/form/a44b6046-27f0-4c74-972c-290efadd54d4"
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Completar formulario de contacto →
            </a>
          </div>

          <div className="cta-divider reveal">o contactanos directo</div>

          <div className="cta-actions reveal">
            <a
              href={WA_LINK}
              className="btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 WhatsApp directo
            </a>
            <a href={`mailto:${EMAIL}`} className="btn-secondary">
              ✉ Enviar email
            </a>
          </div>
          <p style={{ marginTop: "24px", fontSize: "13px", color: "var(--muted)" }}>
            Respondemos en menos de 24hs · Argentina & Latam
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="/" className="logo">
          cosa<span className="accent">santa</span>
          <span className="muted">.ai</span>
        </a>
        <div className="footer-links">
          <a href="#servicios">Servicios</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#blog">Blog</a>
          <a href="#contacto">Contacto</a>
        </div>
        <div className="footer-copy">
          © 2026 CosaSanta · Argentina & Latam · hecho en Misiones
        </div>
        <div className="footer-copy" style={{ marginTop: "8px", fontSize: "12px" }}>
          Páginas web · Bots WhatsApp · Marketing Digital · Merchandising · Argentina & Latam
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
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
