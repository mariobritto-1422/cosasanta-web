# AUTOPOST.md — Memoria permanente del módulo AutoPost
# CosaSanta Web · Última actualización: 2026-04-04

---

## ¿Qué es AutoPost?

Herramienta freemium en `/autopost` que genera un calendario de posts para redes sociales
usando IA (Claude Sonnet 4.6 vía n8n). El usuario completa un chatbot de 4 preguntas y
recibe posts listos para copiar. Monetización: 7 días de trial gratis → USD 29/mes via
MercadoPago.

---

## Arquitectura

```
Usuario
  │
  ├─→ /autopost (page.tsx)
  │     └─→ AgenteContenido.tsx (chatbot WhatsApp-style)
  │           ├─→ /api/autopost/usuario   (verificar/crear cuenta)
  │           ├─→ /api/generar-posts      (generar posts via n8n)
  │           └─→ /api/autopost/suscripcion (iniciar pago MP)
  │
  ├─→ MercadoPago → /api/webhooks/mercadopago (confirmar pago)
  │
  └─→ n8n workflow "AutoPost — Generar Posts" (1h8xvmvdAp4xPPg9)
        ├─→ Webhook /autopost-generar
        ├─→ Armar Prompt (Code node)
        ├─→ Llamar Anthropic (HTTP Request → api.anthropic.com)
        └─→ Parsear Respuesta (Code node) → devuelve { posts: [...] }
```

### Supabase
- **Instancia:** `fczzbntzrgxsoylkcggr.supabase.co` (compartida con CosaSanta Web)
- **Tabla `autopost_users`:** usuarios registrados (email, estado, trial_fin)
- **Tabla `autopost_leads`:** registro de cada generación completada

### n8n
- **Instancia:** https://cosa-santa-n8n.6nfych.easypanel.host
- **Workflow ID:** `1h8xvmvdAp4xPPg9`
- **Webhook path:** `/webhook/autopost-generar`
- **Modelo:** `claude-sonnet-4-6` · max_tokens: 6000

---

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| `src/app/autopost/page.tsx` | Renderiza `<AgenteContenido />` |
| `src/components/AgenteContenido.tsx` | Chatbot completo: flujo, pantallas, estado, calendario |
| `src/app/api/autopost/usuario/route.ts` | POST: verifica email → crea trial 7d / devuelve estado |
| `src/app/api/autopost/suscripcion/route.ts` | POST: crea preferencia MercadoPago → devuelve init_point |
| `src/app/api/webhooks/mercadopago/route.ts` | POST: webhook MP → actualiza estado a "pro" |
| `src/app/api/generar-posts/route.ts` | POST: recibe datos, llama n8n, normaliza respuesta |

---

## Flujo de estados de usuario

```
idle (pedir email)
  │
  ↓ verificarUsuario(email)
checking
  │
  ├─→ trial    (nuevo usuario O trial vigente) → arranca bot
  ├─→ pro      (pagó)                          → arranca bot
  └─→ expired  (trial vencido)                 → pantalla paywall
```

La API `/api/autopost/usuario`:
- Busca en `autopost_users` por email
- Si no existe → INSERT con `estado='trial'`, `trial_fin = ahora + 7 días`
- Si existe y `estado='trial'` y no expiró → devuelve días restantes
- Si existe y `estado='trial'` y expiró → UPDATE a `'expired'`
- Si `estado='pro'` → pasa directo

**Nota:** usa `supabaseAnon` para SELECT y `supabaseAdmin` para INSERT/UPDATE.
El SELECT con anon key puede fallar si hay RLS restrictiva en `autopost_users`.

---

## Flujo del chatbot (AgenteContenido.tsx)

```
STEPS array (6 pasos):
  0. bienvenida   → opciones: "¡Sí, empecemos!" / "¿Cómo funciona?"
  1. nombre       → texto libre
  2. rubro        → texto libre
  3. tono         → 4 opciones predefinidas
  4. objetivo     → 4 opciones predefinidas
  5. generando    → loading → llama /api/generar-posts → muestra calendario
```

Al llegar al paso "generando" (tipo: "loading"), el componente hace fetch a `/api/generar-posts`
con `{ nombre, rubro, tono, objetivo }` y muestra el calendario cuando recibe respuesta.

---

## Prompt exacto enviado a Anthropic

*(Nodo "Armar Prompt" del workflow n8n 1h8xvmvdAp4xPPg9 — actualizado 2026-04-03)*

```
Eres un experto en marketing digital latinoamericano. Genera un calendario de 6 publicaciones 
para redes sociales (Instagram/Facebook/LinkedIn) para la siguiente empresa:

EMPRESA: ${nombre}
RUBRO: ${rubro}
TONO: ${tonoMap[tono] || tono}
OBJETIVO: ${objMap[objetivo] || objetivo}

Genera exactamente 6 posts distribuidos en 2 semanas (3 por semana).
Para cada post incluye:
- Semana (1 o 2)
- Día sugerido (Lunes, Miércoles o Viernes)
- Tipo de contenido: Educativo / Promocional / Inspiracional / Interactivo / Storytelling
- Texto completo del post (listo para publicar, con emojis naturales, lenguaje latinoamericano)
- 5 hashtags relevantes en español

Responde SOLO con JSON válido. Sin markdown. Sin texto antes ni después. Estructura exacta:
{
  "posts": [
    {
      "semana": 1,
      "dia": "Lunes",
      "tipo": "Educativo",
      "texto": "texto completo aquí",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
    }
  ]
}

Personalizá todo para ${nombre} en el rubro de ${rubro}.
Cada post debe tener máximo 150 palabras. Sin introducción ni explicación, devolvé solo el JSON.
```

### Mapeos de tono y objetivo

```js
tonoMap = {
  "🎯 Profesional y serio":       "profesional, formal y confiable",
  "😊 Cercano y amigable":        "cercano, cálido y conversacional",
  "🔥 Energético y motivador":    "energético, dinámico y motivacional",
  "✨ Elegante y aspiracional":   "elegante, sofisticado y aspiracional"
}

objMap = {
  "📈 Conseguir más clientes":     "atraer nuevos clientes potenciales",
  "💡 Posicionarme como experto":  "posicionarse como referente en el sector",
  "🛍️ Vender productos/servicios": "generar ventas directas",
  "❤️ Fidelizar clientes actuales":"fidelizar y mantener clientes existentes"
}
```

---

## Copy actual en pantalla

| Pantalla/Lugar | Texto |
|---|---|
| Pantalla email | "Ingresá tu email para empezar tu **prueba gratuita de 7 días**" |
| Botón email | "Empezar prueba gratuita →" |
| Footer email | "7 días gratis · Sin tarjeta · Sin compromiso" |
| Header chat | días restantes de prueba (badge naranja) |
| Bienvenida bot | "te genero un **calendario completo de publicaciones** personalizado" |
| Bienvenida bot | "Genero posts para Instagram, Facebook y LinkedIn — con texto, formato y hashtags listos para publicar" |
| Mensaje final bot | "Generé **X publicaciones** personalizadas para tu marca — distribuidas en **4 semanas**" |
| Paywall (expired) | **USD 29/mes** · "6 posts mensuales generados con IA" |
| Paywall (expired) | "Instagram + Facebook + LinkedIn · Textos + hashtags + calendario" |
| CTA al pie | "Automatizá la publicación en todas tus redes desde USD 29/mes" |
| UI calendario | Pestañas: **Sem 1 · Sem 2 · Sem 3 · Sem 4** |

---

## Decisiones técnicas

**¿Por qué n8n y no llamar Anthropic directo desde Next.js?**
- Netlify Functions tienen timeout de 10s. n8n corre en EasyPanel sin límite de tiempo.
- `maxDuration = 60` en route.ts es el límite de Next.js en Netlify, no de la función en sí.
- n8n permite iterar el prompt sin tocar código ni hacer deploy.

**¿Por qué `supabaseAnon` para SELECT en `/api/autopost/usuario`?**
- Al momento de implementación se usó anon para SELECT y admin para escritura.
- Riesgo: si RLS bloquea SELECT anon en `autopost_users`, el usuario nunca encontrará su cuenta
  y se creará un duplicado en cada visita. Verificar políticas RLS.

**¿Por qué guardar `posts_generados: 6` hardcodeado en `autopost_leads`?**
- Se hardcodeó porque siempre se generan 6. No se verifica el conteo real devuelto por n8n.

**Trial de 7 días sin tarjeta:**
- Se decidió no pedir tarjeta para bajar fricción de entrada.
- `trial_fin` se calcula en Supabase con `DEFAULT now() + interval '7 days'`.

---

## ⚠️ Inconsistencias detectadas (pre-refactor 2026-04-04)

### 1. CRÍTICA — 2 semanas generadas vs UI de 4 semanas
- **n8n genera:** `semana: 1` o `semana: 2` únicamente (prompt dice "2 semanas")
- **UI muestra:** pestañas Sem 1, Sem 2, Sem 3, Sem 4
- **Resultado:** Sem 3 y Sem 4 aparecen siempre vacías para el usuario

### 2. CRÍTICA — Mensaje bot miente sobre semanas
- **Código (AgenteContenido.tsx ~línea 393):**
  ```
  "distribuidas en 4 semanas"
  ```
- **Realidad:** distribuidas en 2 semanas
- El usuario ve las 4 pestañas pero 2 están vacías → frustración / desconfianza

### 3. MENOR — "Calendario completo" con solo 6 posts en 2 semanas
- La bienvenida dice "calendario completo de publicaciones"
- 6 posts en 2 semanas no cubre un mes completo
- El paywall dice "6 posts mensuales" — correcto en número pero se entrega en solo 2 semanas

### 4. MENOR — `posts_generados` hardcodeado
- `route.ts` guarda `posts_generados: 6` sin verificar la respuesta real de n8n

---

## Pendientes

- [ ] **Resolver inconsistencia semanas:** decidir si n8n genera 12 posts (4 semanas) o el UI
      muestra solo 2 semanas. Opción A es más valor; Opción B es más honesta sin costo extra.
- [ ] **Actualizar mensaje bot:** cambiar "4 semanas" por el número real una vez resuelto.
- [ ] **Verificar RLS en `autopost_users`:** confirmar que anon key puede hacer SELECT.
- [ ] **Guardar `posts_generados` dinámico:** usar `data.posts.length` en vez de hardcodear 6.
- [ ] **Emails post-registro:** enviar email de bienvenida al crear trial (Resend).
- [ ] **Email de expiración:** recordatorio 1 día antes de que venza el trial.
- [ ] **Panel de admin:** ver cuántos trials activos, conversiones, ingresos.
- [ ] **Modo pro:** diferenciación real de funcionalidades entre trial y pro (hoy son iguales).

---

## Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADOPAGO_ACCESS_TOKEN=
```

La URL del webhook n8n está hardcodeada en `generar-posts/route.ts`:
```
https://cosa-santa-n8n.6nfych.easypanel.host/webhook/autopost-generar
```
Moverla a variable de entorno es pendiente menor.
