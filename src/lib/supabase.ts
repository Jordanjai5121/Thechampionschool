import { createClient } from '@supabase/supabase-js'

// Supabase publishable keys (sb_publishable_...) are intended for browser use.
// Keep service_role / secret keys out of all VITE_ variables and frontend code.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string | undefined

export const supabaseConfigured = Boolean(url && key)

// The local fallback only prevents the client from crashing when env vars are absent.
// Forms and admin login remain disabled unless both real values are configured.
export const supabase = createClient(
  url || 'http://localhost:54321',
  key || 'missing-public-key',
)
