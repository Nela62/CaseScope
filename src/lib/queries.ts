import { TypedSupabaseClient } from "@/types/supabase";

export const fetchAllDocuments = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("documents")
    .select("id, name, created_at")
    .throwOnError();
};
