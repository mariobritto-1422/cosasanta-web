import { NextRequest, NextResponse } from "next/server";
import { getSupabasePublic, logSupabaseError } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    const supabaseAdmin = getSupabaseAdmin();

    // Buscar usuario existente
    const { data: existing, error: errorBusqueda } = await getSupabasePublic()
      .from("autopost_users")
      .select("*")
      .eq("email", emailLower)
      .maybeSingle();

    // Si la búsqueda falla no sabemos el estado real: no crear un trial nuevo.
    if (errorBusqueda) {
      logSupabaseError("autopost/usuario: buscar usuario", errorBusqueda);
      return NextResponse.json({ error: "No se pudo verificar el usuario" }, { status: 500 });
    }

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
        const { error: errorUpdate } = await supabaseAdmin
          .from("autopost_users")
          .update({ estado: "expired" })
          .eq("email", emailLower);
        logSupabaseError("autopost/usuario: marcar trial vencido", errorUpdate);
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
      logSupabaseError("autopost/usuario: crear usuario", error);
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
