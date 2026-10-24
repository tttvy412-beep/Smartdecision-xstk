import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase = url && key ? createClient(url, key) : { from: () => ({ select: () => ({ order: async () => ({ data: [], error: { message: 'Thiếu biến môi trường Supabase' } }) }) }) };
