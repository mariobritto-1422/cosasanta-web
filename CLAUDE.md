# CLAUDE.md — CosaSanta Web
# Última actualización: 2026-03-18

## PROYECTO
Sitio web corporativo de Cosasanta.ai — agencia de IA y desarrollo SaaS en Posadas, Misiones.

**Ruta:** `C:\Users\mario\cc_paraguas\12_CosaSanta_Web\cosasanta-web\`
**Estado:** 🟢 Deployado en producción
**URL:** https://cosasanta.com
**Repo:** github.com/mariobritto-1422/cosasanta-web (rama: **master**)
**Deploy:** Netlify CI/CD desde GitHub master → cosasanta.com
**Supabase:** `fczzbntzrgxsoylkcggr.supabase.co`

---

## STACK
```
Next.js 16.1.6 · React 19 · TypeScript · TailwindCSS 4 · Supabase
@netlify/plugin-nextjs v5 · @next/third-parties (GTM) · Google Tag Manager GTM-PTJ7RM9V
```

## ESTRUCTURA
```
cosasanta-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generar-posts/route.ts        ← llama a n8n webhook
│   │   │   ├── autopost/
│   │   │   │   ├── usuario/route.ts          ← verifica suscripción por email
│   │   │   │   └── suscripcion/route.ts      ← inicia pago MercadoPago
│   │   │   └── webhooks/mercadopago/route.ts ← confirmación de pago
│   │   ├── autopost/page.tsx                 ← renderiza AgenteContenido
│   │   ├── blog/
│   │   │   ├── page.tsx                      ← listado SSR (Server Component)
│   │   │   └── [slug]/page.tsx               ← artículo SSR + ISR + Schema markup
│   │   ├── layout.tsx                        ← GTM + fuentes + metadata SEO
│   │   ├── page.tsx                          ← home completo (~502 líneas)
│   │   └── globals.css                       ← sistema de diseño (~846 líneas)
│   ├── components/
│   │   ├── LeadForm.tsx                      ← form contacto → tabla leads
│   │   └── AgenteContenido.tsx               ← chatbot AutoPost (702 líneas)
│   └── lib/
│       └── supabase.ts                       ← createClient anon
├── public/
│   └── googlec56ec697a387773c.html           ← verificación Search Console
├── next.config.ts
└── netlify.toml
```

## SCRIPTS
```bash
npm run dev     # desarrollo local
npm run build   # build producción
npm run start   # servidor
```

## VARIABLES DE ENTORNO (.env.example)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## TABLAS SUPABASE
| Tabla | Descripción |
|---|---|
| `leads` | Form de contacto (nombre, email, whatsapp, mensaje, origen: 'cosasanta-web') |
| `blog_posts` | Artículos del blog (id, titulo, slug, resumen, categoria, publicado, created_at) |
| `autopost_leads` | Leads de AutoPost que completaron el chatbot |
| `usuarios_autopost` | Usuarios con suscripción AutoPost activa/inactiva |

## DISEÑO — SISTEMA DE VARIABLES CSS
```css
--bg: #0a0a0a        /* fondo principal */
--bg2: #111111
--bg3: #161616
--accent: #b8f542    /* verde lima — color principal */
--accent2: #42f5c8   /* turquesa secundario */
--text: #f0f0ee      /* texto principal */
--muted: #888880     /* texto secundario */
--border: #222220
--card: #141414
```
**Fuentes:** Plus Jakarta Sans (logos/títulos 800w) + DM Sans (cuerpo 300-500w)

## INTEGRACIÓN AUTOPOST
- Chatbot en `/autopost` — 7 días trial → pago MercadoPago
- API `/api/generar-posts` → llama a n8n webhook (URL en `.env.local`)
- API `/api/webhooks/mercadopago` → confirma pago y activa suscripción
- Componente `AgenteContenido.tsx` maneja flujo completo del chatbot

## INTEGRACIÓN GTM
- ID: `GTM-PTJ7RM9V`
- Integrado en `layout.tsx` con `@next/third-parties/google`

## BLOG — ARQUITECTURA SSR/ISR (desde 2026-03-19)
- Rutas dinámicas `[slug]` implementadas: `/blog/[slug]/page.tsx`
- `generateStaticParams` pre-renderiza slugs publicados al momento del build
- `dynamicParams = true` (default) + `revalidate = 3600`: artículos nuevos de N8N se renderizan SSR en primera visita, cacheados 1h (ISR)
- `generateMetadata` por artículo: title, description, og:image, canonical
- Schema markup `BlogPosting` JSON-LD en cada artículo
- Redirect 301 en `next.config.ts`: `/blog?post=slug` → `/blog/slug`
- **NOTA LOCAL:** en `npm run dev` con Turbopack puede haber problemas con `[slug]`. Testear con `npm run build && npm run start`

## LECCIÓN CRÍTICA — DEPLOYS NETLIFY
> Si hay cambios sin commitear, Netlify CI/CD NO los incluirá en el build.
> **Siempre commitear y pushear a master ANTES de verificar en producción.**
> El build local no garantiza que CI/CD tenga los mismos archivos.

## ALERTAS ACTIVAS
- ⚠️ `page.tsx` y `globals.css` tienen cambios locales sin commitear (verificar git status)
- Siempre corroborar que master está al día antes de dar un deploy por bueno

## PRÓXIMOS PASOS
- [ ] Commitear y pushear cambios pendientes en page.tsx y globals.css
- [ ] Agregar posts al blog en Supabase Dashboard
- [ ] Expandir funcionalidades AutoPost según crecimiento de usuarios

## IDIOMA
Comunicarse SIEMPRE en español. El código puede estar en inglés técnico.
