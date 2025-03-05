import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ecjngvejietrxojgnodj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjam5ndmVqaWV0cnhvamdub2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMzg0NTYsImV4cCI6MjA1NjYxNDQ1Nn0.VIre083ZHyyx7zqzGtzFf5-Vj5wB-9YVorSCy6oqy_g",
);

export default supabase;
