import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Buscar usuario existente
    const { data: existing } = await supabaseAnon
      .from("autopost_users")
      .select("*")
      .eq("email", emailLower)
      .single();

    if (existing) {
      const ahora = new Date();
      const trialFin = new Date(existing.trial_fin);

      if (existing.estado === "pro") {
        return NextResponse.json({ estado: "pro", email: emailLower });
      }

      if (existing.estado === "trial" && ahora < trialFin) {
        const diasRestantes = Math.ceil(
          (trialFin.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
        );
        return NextResponse.json({
          estado: "trial",
          email: emailLower,
          diasRestantes,
          trialFin: existing.trial_fin,
        });
      }

      // Trial expirado — actualizar estado
      if (existing.estado === "trial" && ahora >= trialFin) {
        await supabaseAdmin
          .from("autopost_users")
          .update({ estado: "expired" })
          .eq("email", emailLower);
        return NextResponse.json({ estado: "expired", email: emailLower });
      }

      if (existing.estado === "expired") {
        return NextResponse.json({ estado: "expired", email: emailLower });
      }
    }

    // Usuario nuevo — crear con trial de 7 días
    const { data: nuevo, error } = await supabaseAdmin
      .from("autopost_users")
      .insert({ email: emailLower, estado: "trial" })
      .select()
      .single();

    if (error) {
      console.error("Error creando usuario:", error);
      return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
    }

    return NextResponse.json({
      estado: "trial",
      email: emailLower,
      diasRestantes: 7,
      trialFin: nuevo.trial_fin,
      nuevo: true,
    });

  } catch (error) {
    console.error("Error en /api/autopost/usuario:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
