import { createClient } from '@supabase/supabase-js';

export const useSupabase = () => {
  const {
    supabaseServiceKey,
    public: { supabaseUrl },
  } = useRuntimeConfig();

  return createClient(supabaseUrl, supabaseServiceKey);
};
