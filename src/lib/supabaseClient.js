import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yjjfkaqxsojvnvaaezdi.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_4k7FiqRHNOHgQnwEQtfCVw_Ief3sIkX";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
