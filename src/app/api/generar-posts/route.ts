import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { nombre, rubro, tono, objetivo, whatsapp } = await req.json();

    if (!nombre || !rubro || !tono || !objetivo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.from("autopost_leads").insert({
      nombre,
      rubro,
      tono,
      objetivo,
      whatsapp: whatsapp || null,
      posts_generados: 12,
    });

    const tonoMap: Record<string, string> = {
      "🎯 Profesional y serio": "profesional, formal y confiable",
      "😊 Cercano y amigable": "cercano, cálido y conversacional",
      "🔥 Energético y motivador": "energético, dinámico y motivacional",
      "✨ Elegante y aspiracional": "elegante, sofisticado y aspiracional",
    };

    const objMap: Record<string, string> = {
      "📈 Conseguir más clientes": "atraer nuevos clientes potenciales",
      "💡 Posicionarme como experto": "posicionarse como referente en el sector",
      "🛍️ Vender productos/servicios": "generar ventas directas",
      "❤️ Fidelizar clientes actuales": "fidelizar y mantener clientes existentes",
    };

    const prompt = `Eres un experto en marketing digital latinoamericano. Genera un calendario de 12 publicaciones para redes sociales (Instagram/Facebook/LinkedIn) para la siguiente empresa:

EMPRESA: ${nombre}
RUBRO: ${rubro}
TONO: ${tonoMap[tono] || tono}
OBJETIVO: ${objMap[objetivo] || objetivo}

Genera exactamente 12 posts distribuidos en 4 semanas (3 por semana).
Para cada post incluye:
- Semana (1 a 4)
- Día sugerido (Lunes, Miércoles, Viernes o similar)
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

Personalizá todo para ${nombre} en el rubro de ${rubro}. Los textos deben sonar naturales, no genéricos.`;

    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error("Anthropic API error:", errorText);
      return NextResponse.json(
        { error: "Error al conectar con la IA. Intentá de nuevo." },
        { status: 500 }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const rawText = anthropicData.content?.[0]?.text || "";

    try {
      const cleanText = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanText);

      if (!parsed.posts || !Array.isArray(parsed.posts)) {
        throw new Error("Estructura de respuesta inválida");
      }

      return NextResponse.json(parsed);
    } catch {
      console.error("Error parsing AI response:", rawText);
      return NextResponse.json(
        { error: "Error procesando la respuesta de la IA." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error en /api/generar-posts:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
