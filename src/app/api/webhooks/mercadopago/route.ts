import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("MP Webhook recibido:", JSON.stringify(body));

    if (body.type === "subscription_preapproval") {
      const preapprovalId = body.data?.id;

      if (!preapprovalId) {
        return NextResponse.json({ ok: true });
      }

      const mpResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      if (!mpResponse.ok) {
        console.error("Error consultando MP:", await mpResponse.text());
        return NextResponse.json({ ok: true });
      }

      const subscription = await mpResponse.json();
      const email = subscription.payer_email?.toLowerCase();
      const status = subscription.status;

      if (!email) {
        console.error("No se encontró email en la suscripción");
        return NextResponse.json({ ok: true });
      }

      if (status === "authorized") {
        await supabaseAdmin
          .from("autopost_users")
          .upsert(
            { email, estado: "pro", mp_preapproval_id: preapprovalId },
            { onConflict: "email" }
          );
        console.log(`✅ Usuario ${email} activado como Pro`);
      }

      if (status === "cancelled" || status === "paused") {
        await supabaseAdmin
          .from("autopost_users")
          .update({ estado: "expired" })
          .eq("email", email);
        console.log(`⚠️ Suscripción cancelada para ${email}`);
      }
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Error en webhook MP:", error);
    return NextResponse.json({ ok: true }); // Siempre 200 a MP
  }
}
