import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Las claves se leen SOLO de variables de entorno (configuradas en Netlify),
// nunca de archivos del repositorio.
// NEXT_PUBLIC_* se incrustan en el bundle al momento del build: si cambian,
// hace falta un redeploy.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let publicClient: SupabaseClient | null = null;

// Cliente con la clave pública (publishable). Sirve en servidor y navegador;
// los permisos los define RLS.
export function getSupabasePublic(): SupabaseClient {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }
  if (!publicClient) {
    publicClient = createClient(supabaseUrl, supabasePublishableKey);
  }
  return publicClient;
}

// Registra un error de Supabase para que aparezca en los logs de Netlify.
export function logSupabaseError(
  contexto: string,
  error: { message: string; code?: string; details?: string; hint?: string } | null
) {
  if (!error) return;
  // Los errores de la API (ej. clave inválida) suelen venir sin código:
  // details/hint traen el motivo.
  console.error(
    `[supabase] ${contexto}: ${error.message} (código: ${error.code || "sin código"})`,
    error.details || error.hint ? { details: error.details, hint: error.hint } : ""
  );
}
