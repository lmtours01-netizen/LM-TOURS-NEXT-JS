
import { createClient } from '@supabase/supabase-js';

// --------------------------------------------------------------------------
// SUPABASE CONFIGURATION
// 1. Go to your Supabase Project Settings -> API
// 2. Paste the 'Project URL' into SUPABASE_URL
// 3. Paste the 'anon public' key into SUPABASE_ANON_KEY
// --------------------------------------------------------------------------

const SUPABASE_URL = 'https://btjzzxfhdwutdievqbur.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0anp6eGZoZHd1dGRpZXZxYnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NzY2NTQsImV4cCI6MjA4NDU1MjY1NH0.YMEznX7UjF5gN46bdDSUc8N7Y2GmJXg7y61e2o_Kx2Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
