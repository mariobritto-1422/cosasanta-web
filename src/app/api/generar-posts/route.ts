import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { nombre, rubro, tono, objetivo, whatsapp } = await req.json();

    if (!nombre || !rubro || !tono || !objetivo) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // Guardar lead en Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from("autopost_leads").insert({
      nombre, rubro, tono, objetivo,
      whatsapp: whatsapp || null,
      posts_generados: 6,
    });

    // Llamar a n8n — sin timeout de Netlify
    const n8nResponse = await fetch(
      "https://cosa-santa-n8n.6nfych.easypanel.host/webhook/autopost-generar",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, rubro, tono, objetivo }),
      }
    );

    if (!n8nResponse.ok) {
      console.error("n8n error:", await n8nResponse.text());
      return NextResponse.json(
        { error: "Error al generar contenido. Intentá de nuevo." },
        { status: 500 }
      );
    }

    const raw = await n8nResponse.json();

    // n8n devuelve array de items [{ posts: [...] }], normalizar
    const data = Array.isArray(raw) ? raw[0] : raw;

    if (!data?.posts?.length) {
      return NextResponse.json(
        { error: "Error procesando respuesta. Intentá de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error en /api/generar-posts:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
