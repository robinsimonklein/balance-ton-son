import { createClient } from '@supabase/supabase-js';

export const useSupabase = () => {
  const {
    public: { supabaseUrl, supabaseKey },
  } = useRuntimeConfig();

  return createClient(supabaseUrl, supabaseKey);
};
