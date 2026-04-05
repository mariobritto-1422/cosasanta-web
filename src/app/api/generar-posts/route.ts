import { NextRequest, NextResponse } from "next/server";
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
  try {
    const { nombre, rubro, tono, objetivo } = await req.json();

    if (!nombre || !rubro || !tono || !objetivo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
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
      console.error("AutoPost Anthropic error:", await anthropicRes.text());
      return NextResponse.json(
        { error: "Error al generar contenido. Intentá de nuevo." },
        { status: 500 }
      );
    }

    const anthropicData = await anthropicRes.json();

    if (anthropicData.stop_reason === "max_tokens") {
      console.error("AutoPost: respuesta truncada por max_tokens");
      return NextResponse.json(
        { error: "Error al generar contenido. Intentá de nuevo." },
        { status: 500 }
      );
    }

    console.log("AutoPost stop_reason:", anthropicData.stop_reason);

    const rawText = anthropicData.content?.[0]?.text ?? "";
    const clean   = rawText.replace(/```json|```/g, "").trim();

    let parsed: { posts: unknown[] };
    try {
      parsed = JSON.parse(clean);
    } catch (e) {
      console.error("AutoPost: JSON inválido de Anthropic:", e);
      return NextResponse.json(
        { error: "Error procesando respuesta. Intentá de nuevo." },
        { status: 500 }
      );
    }

    if (!parsed?.posts?.length) {
      return NextResponse.json(
        { error: "Error procesando respuesta. Intentá de nuevo." },
        { status: 500 }
      );
    }

    // Guardar lead en Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from("autopost_leads").insert({
      nombre,
      rubro,
      tono,
      objetivo,
      posts_generados: parsed.posts.length,
    });

    return NextResponse.json({ posts: parsed.posts });

  } catch (error) {
    console.error("Error en /api/generar-posts:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
