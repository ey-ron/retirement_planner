/**
 * Supabase Client Configuration & Stubs
 * 
 * When ready to activate Supabase:
 * 1. Install dependencies: npm install @supabase/supabase-js @supabase/ssr
 * 2. Add to .env.local:
 *    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

export const isSupabaseConfigured = () => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

/**
 * Creates a browser-side Supabase client instance
 */
export function createBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  // Placeholder for @supabase/ssr createBrowserClient or @supabase/supabase-js createClient
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  } catch {
    console.warn('Supabase packages not yet installed. Run: npm install @supabase/supabase-js');
    return null;
  }
}
