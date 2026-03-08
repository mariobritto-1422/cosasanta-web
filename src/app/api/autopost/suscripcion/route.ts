import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN!;

    const response = await fetch("https://api.mercadopago.com/preapproval_plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason: "AutoPost Pro — cosa$anta",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 29,
          currency_id: "USD",
        },
        payment_methods_allowed: {
          payment_types: [{ id: "credit_card" }, { id: "debit_card" }],
        },
        back_url: `https://cosasanta.com/autopost?pago=exitoso&email=${encodeURIComponent(email)}`,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("MP error:", err);
      return NextResponse.json(
        { error: "Error creando suscripción en MercadoPago" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      init_point: data.init_point,
      plan_id: data.id,
    });

  } catch (error) {
    console.error("Error en /api/autopost/suscripcion:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
