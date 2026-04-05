# AUTOPOST.md — Memoria permanente del módulo AutoPost
# CosaSanta Web · Última actualización: 2026-04-05

---

## ¿Qué es AutoPost?

Herramienta freemium en `/autopost` que genera 3 posts para redes sociales usando IA
(Claude Sonnet 4.6, llamada directa). El usuario completa un chatbot de 4 preguntas y
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
  │           ├─→ /api/generar-posts      (generar posts — Anthropic directo)
  │           └─→ /api/autopost/suscripcion (iniciar pago MP)
  │
  └─→ MercadoPago → /api/webhooks/mercadopago (confirmar pago)
```

**No hay n8n en el flujo de generación.** Llamada directa a `api.anthropic.com/v1/messages`.

### Supabase
- **Instancia:** `fczzbntzrgxsoylkcggr.supabase.co` (compartida con CosaSanta Web)
- **Tabla `autopost_users`:** usuarios registrados (email, estado, trial_fin)
- **Tabla `autopost_leads`:** registro de cada generación completada

### Anthropic
- **Modelo:** `claude-sonnet-4-6`
- **max_tokens:** 2000
- **Tiempo de respuesta:** ~15-20s en producción (Netlify, sin cold start)
- **maxDuration:** 30s en el route handler

---

## Archivos clave

| Archivo | Responsabilidad |
|---|---|
| `src/app/autopost/page.tsx` | Renderiza `<AgenteContenido />` |
| `src/components/AgenteContenido.tsx` | Chatbot completo: flujo, pantallas, estado, calendario |
| `src/app/api/autopost/usuario/route.ts` | POST: verifica email → crea trial 7d / devuelve estado |
| `src/app/api/autopost/suscripcion/route.ts` | POST: crea preferencia MercadoPago → devuelve init_point |
| `src/app/api/webhooks/mercadopago/route.ts` | POST: webhook MP → actualiza estado a "pro" |
| `src/app/api/generar-posts/route.ts` | POST: recibe datos → llama Anthropic → devuelve 3 posts |

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
Riesgo pendiente: verificar que RLS en `autopost_users` permita SELECT anon.

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

Al llegar al paso "generando", hace `fetch` + `res.json()` a `/api/generar-posts`.
La UI muestra tabs de 4 semanas (Sem 1–4) pero los 3 posts generados son todos semana 1,
por lo que Sem 2, 3 y 4 quedan vacías. Pendiente resolver en próxima iteración de frontend.

---

## Prompt exacto enviado a Anthropic

*(En `src/app/api/generar-posts/route.ts` — actualizado 2026-04-05)*

```
Eres un experto en marketing digital latinoamericano. Genera 3 publicaciones para redes
sociales (Instagram/Facebook/LinkedIn) para la siguiente empresa:

EMPRESA: ${nombre}
RUBRO: ${rubro}
TONO: ${tonoTexto}
OBJETIVO: ${objetivoTexto}

Genera exactamente 3 posts para los días Lunes, Miércoles y Viernes.
Para cada post incluye:
- Semana: siempre 1
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
TONO_MAP = {
  "🎯 Profesional y serio":     "profesional, formal y confiable",
  "😊 Cercano y amigable":      "cercano, cálido y conversacional",
  "🔥 Energético y motivador":  "energético, dinámico y motivacional",
  "✨ Elegante y aspiracional":  "elegante, sofisticado y aspiracional",
}

OBJ_MAP = {
  "📈 Conseguir más clientes":      "atraer nuevos clientes potenciales",
  "💡 Posicionarme como experto":   "posicionarse como referente en el sector",
  "🛍️ Vender productos/servicios": "generar ventas directas",
  "❤️ Fidelizar clientes actuales": "fidelizar y mantener clientes existentes",
}
```

---

## Decisiones técnicas

**¿Por qué 3 posts y no más?**
- Netlify tiene un timeout efectivo de ~26s para el CDN, independiente de `maxDuration`.
- 3 posts con max_tokens 2000 responde en ~15-20s → margen de seguridad.
- 6 posts tardaba ~30s → timeout. 12 posts tardaba ~40s → timeout.
- La decisión fue reducir cantidad para garantizar fiabilidad, no agregar complejidad.

**¿Por qué llamada directa a Anthropic y no n8n?**
- n8n era un intermediario innecesario. El workflow de n8n hacía exactamente lo mismo:
  armar un prompt y llamar a Anthropic. Eliminarlo reduce puntos de fallo.
- Si n8n falla (restart, memoria), AutoPost falla. Sin n8n, solo depende de Anthropic.
- El prompt ahora vive en el código y es versionado con git.

**¿Por qué no SSE/streaming?**
- Se intentó SSE con keepalive pings → Netlify CDN igualmente corta a los ~35s.
- Se intentó streaming verdadero (forwarding de Anthropic chunks) → complejidad innecesaria.
- La solución correcta fue simplificar: menos posts = respuesta más rápida = sin timeout.

**¿Por qué `supabaseAnon` para SELECT en `/api/autopost/usuario`?**
- Al momento de implementación se usó anon para SELECT y admin para escritura.
- Riesgo: si RLS bloquea SELECT anon en `autopost_users`, el usuario nunca encontrará su
  cuenta y se creará un duplicado en cada visita. Verificar políticas RLS.

---

## Copy actual en pantalla

| Pantalla/Lugar | Texto |
|---|---|
| Pantalla email | "Ingresá tu email para empezar tu **prueba gratuita de 7 días**" |
| Botón email | "Empezar prueba gratuita →" |
| Footer email | "7 días gratis · Sin tarjeta · Sin compromiso" |
| Bienvenida bot | "te genero un **calendario completo de publicaciones** personalizado" |
| Mensaje final bot | "Generé **X publicaciones** personalizadas — distribuidas en **4 semanas**" |
| Paywall (expired) | **USD 29/mes** · "✅ 6 posts mensuales generados con IA" |
| UI calendario | Pestañas: Sem 1 · Sem 2 · Sem 3 · Sem 4 |

---

## Inconsistencias conocidas (post-refactor 2026-04-05)

### 1. UI de 4 tabs pero solo Sem 1 tiene posts
- El API genera 3 posts todos con `semana: 1`
- El frontend muestra 4 pestañas → Sem 2, 3 y 4 quedan vacías
- **Pendiente:** simplificar UI a "esta semana" sin tabs, o generar más posts

### 2. Mensaje bot dice "4 semanas" pero entrega 3 posts en 1 semana
- El copy dice "distribuidas en 4 semanas" — ya no es verdad
- **Pendiente:** actualizar copy del frontend cuando se itere la UI

### 3. Paywall dice "6 posts mensuales" pero se generan 3
- La cantidad real es 3 posts por generación
- **Pendiente:** actualizar al iterar frontend

---

## Pendientes

- [ ] **Iterar frontend:** simplificar UI para mostrar solo 3 posts sin tabs de semanas
- [ ] **Actualizar copy:** "3 posts para esta semana" en bot message y paywall
- [ ] **Verificar RLS en `autopost_users`:** confirmar que anon key puede hacer SELECT
- [ ] **Emails:** bienvenida al crear trial, recordatorio 1 día antes de expirar (Resend)
- [ ] **Panel de admin:** trials activos, conversiones, ingresos
- [ ] **Modo pro:** diferenciación real de funcionalidades entre trial y pro

---

## Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADOPAGO_ACCESS_TOKEN=
ANTHROPIC_API_KEY=           ← nueva, reemplaza la llamada a n8n
```

---

## Historial de arquitectura

| Fecha | Cambio |
|---|---|
| 2026-03-09 | Implementación inicial: n8n workflow `1h8xvmvdAp4xPPg9` → 6 posts / 2 semanas |
| 2026-04-04 | Auditoría: documentado todo en AUTOPOST.md. Inconsistencias identificadas. |
| 2026-04-05 | Refactor: n8n eliminado, llamada directa a Anthropic, 3 posts / max_tokens 2000 |
