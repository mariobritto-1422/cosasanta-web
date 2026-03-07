"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type FormState = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    whatsapp: "",
    mensaje: "",
  });
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("leads").insert({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim() || null,
      mensaje: form.mensaje.trim() || null,
      origen: "cosasanta-web",
    });

    if (error) {
      setStatus("error");
      setErrorMsg("Hubo un error al enviar. Escribinos por WhatsApp.");
      return;
    }

    setStatus("success");
    setForm({ nombre: "", email: "", whatsapp: "", mensaje: "" });
  }

  if (status === "success") {
    return (
      <div className="lead-form-success reveal">
        <div className="lead-success-icon">✓</div>
        <h3>¡Mensaje recibido!</h3>
        <p>Te contactamos en menos de 24hs. También podés escribirnos directo por WhatsApp.</p>
      </div>
    );
  }

  return (
    <form className="lead-form reveal" onSubmit={handleSubmit} noValidate>
      <div className="lead-form-row">
        <div className="lead-field">
          <label htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>
        <div className="lead-field">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className="lead-field">
        <label htmlFor="whatsapp">WhatsApp <span className="optional">(opcional)</span></label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="+54 9 376 000-0000"
          value={form.whatsapp}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>
      <div className="lead-field">
        <label htmlFor="mensaje">¿Qué necesitás? <span className="optional">(opcional)</span></label>
        <textarea
          id="mensaje"
          name="mensaje"
          placeholder="Contanos brevemente tu proyecto o consulta..."
          value={form.mensaje}
          onChange={handleChange}
          rows={3}
        />
      </div>
      {status === "error" && (
        <p className="lead-error">{errorMsg}</p>
      )}
      <button
        type="submit"
        className="lead-submit"
        disabled={status === "loading" || !form.nombre.trim() || !form.email.trim()}
      >
        {status === "loading" ? "Enviando..." : "Quiero que me contacten →"}
      </button>
    </form>
  );
}
