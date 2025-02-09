import { TypedSupabaseClient } from "@/types/supabase";

export const fetchAllDocuments = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("documents")
    .select("id, name, created_at")
    .throwOnError();
};

export const fetchAllPublicDocuments = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("public_documents")
    .select("id, name, created_at")
    .throwOnError();
};

export const fetchDocumentById = (
  supabase: TypedSupabaseClient,
  documentId: string
) => {
  return supabase
    .from("documents")
    .select("id, name, created_at")
    .eq("id", documentId)
    .maybeSingle()
    .throwOnError();
};

export const fetchPublicDocumentById = (
  supabase: TypedSupabaseClient,
  documentId: string
) => {
  return supabase
    .from("public_documents")
    .select("id, name, created_at")
    .eq("id", documentId)
    .maybeSingle()
    .throwOnError();
};

export const fetchCaseDetailsByDocumentId = (
  supabase: TypedSupabaseClient,
  documentId: string
) => {
  return supabase
    .from("hearing_cases")
    .select(
      "id, hearing_dates, hearing_officer, landlord_name, property_address, case_numbers, decision, reasoning, total_relief_granted, length_of_tenancy, created_at"
    )
    .eq("document_id", documentId)
    .maybeSingle()
    .throwOnError();
};

export const fetchPublicCaseDetailsByDocumentId = (
  supabase: TypedSupabaseClient,
  documentId: string
) => {
  return supabase
    .from("public_hearing_cases")
    .select(
      "id, hearing_dates, hearing_officer, landlord_name, property_address, case_numbers, decision, reasoning, total_relief_granted, length_of_tenancy, created_at"
    )
    .eq("document_id", documentId)
    .maybeSingle()
    .throwOnError();
};

export const fetchIssuesByDocumentId = (
  supabase: TypedSupabaseClient,
  documentId: string
) => {
  return supabase
    .from("issues")
    .select(
      "id, document_id,  category, subcategory, issue_type, issue_details, duration, tenant_evidence, tenant_citations, landlord_response, landlord_citations, landlord_evidence, decision, relief_granted, relief_description, relief_amount, relief_reason, created_at"
    )
    .eq("document_id", documentId)
    .throwOnError();
};

export const fetchPublicIssuesByDocumentId = (
  supabase: TypedSupabaseClient,
  documentId: string
) => {
  return supabase
    .from("public_issues")
    .select(
      "id, document_id, category, subcategory, issue_type, issue_details, duration, tenant_evidence, tenant_citations, landlord_response, landlord_citations, landlord_evidence, decision, relief_granted, relief_description, relief_amount, relief_reason, created_at"
    )
    .eq("document_id", documentId)
    .throwOnError();
};

export const fetchAllIssues = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("issues")
    .select(
      "id, document_id, case_id (id, hearing_dates, hearing_officer, landlord_name, property_address, case_numbers, decision, reasoning, total_relief_granted, length_of_tenancy, created_at), category, subcategory, issue_type, issue_details, duration, tenant_evidence, tenant_citations, landlord_response, landlord_citations, landlord_evidence, decision, relief_granted, relief_description, relief_amount, relief_reason, created_at"
    )
    .throwOnError();
};

export const fetchAllPublicIssues = (supabase: TypedSupabaseClient) => {
  return supabase
    .from("public_issues")
    .select(
      "id, document_id, case_id (id, hearing_dates, hearing_officer, landlord_name, property_address, case_numbers, decision, reasoning, total_relief_granted, length_of_tenancy, created_at), category, subcategory, issue_type, issue_details, duration, tenant_evidence, tenant_citations, landlord_response, landlord_citations, landlord_evidence, decision, relief_granted, relief_description, relief_amount, relief_reason, created_at"
    )
    .throwOnError();
};
