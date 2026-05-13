import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://tovqkvnijbdzuglfgxlc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdnFrdm5pamJkenVnbGZneGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTAyNDQsImV4cCI6MjA5MzY2NjI0NH0.ZJ4Rrp7LS1tOr_pwpRhENQqnVpKQqSYTXQGh8QGcKs8";

export const supabase = createClient(supabaseUrl, supabaseKey);
