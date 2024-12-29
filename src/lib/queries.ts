import { TypedSupabaseClient } from "@/types/supabase";

export const fetchAllDocuments = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("documents")
    .select("id, name, created_at")
    .throwOnError();
};

export const fetchCaseDetails = (
  supabase: TypedSupabaseClient,
  caseId: string
) => {
  return supabase
    .from("hearing_cases")
    .select(
      "id, hearing_dates, hearing_officer, landlord_name, property_address, case_numbers, decision, reasoning, total_relief_granted, length_of_tenancy, created_at"
    )
    .eq("document_id", caseId)
    .maybeSingle()
    .throwOnError();
};

export const fetchIssues = (supabase: TypedSupabaseClient, caseId: string) => {
  return supabase
    .from("issues")
    .select(
      "id, document_id,  category, subcategory, issue_type, issue_details, duration, tenant_evidence, landlord_counterarguments, landlord_evidence, decision, relief_granted, relief_description, relief_amount, relief_reason, created_at"
    )
    .eq("document_id", caseId)
    .throwOnError();
};
