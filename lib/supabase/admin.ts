import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server-side operations.
 *
 * WARNING: This bypasses RLS. Only use inside API routes / server code
 * after the user has been authenticated and authorized. Never expose
 * this key to the browser (it has no NEXT_PUBLIC_ prefix).
 */
let serviceClient: SupabaseClient | null = null;

export function createServiceClient(): SupabaseClient {
  if (serviceClient) return serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error("Supabase service-role configuration is missing");
  }

  serviceClient = createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serviceClient;
}
