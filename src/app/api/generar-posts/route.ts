import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

const TONO_MAP: Record<string, string> = {
  "🎯 Profesional y serio":     "profesional, formal y confiable",
  "😊 Cercano y amigable":      "cercano, cálido y conversacional",
  "🔥 Energético y motivador":  "energético, dinámico y motivacional",
  "✨ Elegante y aspiracional":  "elegante, sofisticado y aspiracional",
};

const OBJ_MAP: Record<string, string> = {
  "📈 Conseguir más clientes":      "atraer nuevos clientes potenciales",
  "💡 Posicionarme como experto":   "posicionarse como referente en el sector",
  "🛍️ Vender productos/servicios": "generar ventas directas",
  "❤️ Fidelizar clientes actuales": "fidelizar y mantener clientes existentes",
};

export async function POST(req: NextRequest) {
  const enc = new TextEncoder();

  let nombre: string, rubro: string, tono: string, objetivo: string;
  try {
    ({ nombre, rubro, tono, objetivo } = await req.json());
  } catch {
    return new Response(
      `data: ${JSON.stringify({ error: "Payload inválido" })}\n\ndata: [DONE]\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  if (!nombre || !rubro || !tono || !objetivo) {
    return new Response(
      `data: ${JSON.stringify({ error: "Faltan datos requeridos" })}\n\ndata: [DONE]\n\n`,
      { status: 400, headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const tonoTexto     = TONO_MAP[tono]    || tono;
  const objetivoTexto = OBJ_MAP[objetivo] || objetivo;

  const prompt = `Eres un experto en marketing digital latinoamericano. Genera un calendario de 12 publicaciones para redes sociales (Instagram/Facebook/LinkedIn) para la siguiente empresa:

EMPRESA: ${nombre}
RUBRO: ${rubro}
TONO: ${tonoTexto}
OBJETIVO: ${objetivoTexto}

Genera exactamente 12 posts distribuidos en 4 semanas (3 por semana).
Para cada post incluye:
- Semana (1, 2, 3 o 4)
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
Cada post debe tener máximo 150 palabras. Sin introducción ni explicación, devolvé solo el JSON.`;

  const stream = new ReadableStream({
    async start(controller) {
      // Keepalive ping cada 5s para que el CDN de Netlify no corte la conexión
      const ping = setInterval(() => {
        controller.enqueue(enc.encode(": ping\n\n"));
      }, 5000);

      try {
        const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key":         process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type":      "application/json",
          },
          body: JSON.stringify({
            model:      "claude-sonnet-4-6",
            max_tokens: 6000,
            messages:   [{ role: "user", content: prompt }],
          }),
        });

        if (!anthropicRes.ok) {
          const err = await anthropicRes.text();
          console.error("AutoPost Anthropic error:", err);
          throw new Error("anthropic_error");
        }

        const anthropicData = await anthropicRes.json();

        if (anthropicData.stop_reason === "max_tokens") {
          console.error("AutoPost: respuesta truncada por max_tokens");
          throw new Error("max_tokens");
        }

        console.log("AutoPost stop_reason:", anthropicData.stop_reason);

        const rawText = anthropicData.content?.[0]?.text ?? "";
        const clean   = rawText.replace(/```json|```/g, "").trim();

        let parsed: { posts: unknown[] };
        try {
          parsed = JSON.parse(clean);
        } catch (e) {
          console.error("AutoPost: JSON inválido de Anthropic:", e);
          throw new Error("json_parse");
        }

        if (!parsed?.posts?.length) throw new Error("no_posts");

        // Guardar lead en Supabase (fire-and-forget, no bloqueamos el stream)
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        void (async () => {
          try {
            await supabase.from("autopost_leads").insert({
              nombre, rubro, tono, objetivo,
              posts_generados: parsed.posts.length,
            });
          } catch (e) { console.error("autopost_leads insert:", e); }
        })();

        clearInterval(ping);
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ posts: parsed.posts })}\n\n`));
        controller.enqueue(enc.encode("data: [DONE]\n\n"));
        controller.close();

      } catch {
        clearInterval(ping);
        controller.enqueue(
          enc.encode(`data: ${JSON.stringify({ error: "Error al generar contenido. Intentá de nuevo." })}\n\n`)
        );
        controller.enqueue(enc.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection":    "keep-alive",
    },
  });
}
