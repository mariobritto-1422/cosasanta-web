import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cliente con la clave secreta: saltea RLS. Solo para rutas API del servidor;
// "server-only" hace fallar el build si se importa desde un componente cliente.
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY");
  }
  if (!adminClient) {
    adminClient = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}
