-- Create the documents table
CREATE TABLE IF NOT EXISTS public_documents(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable row level security on the documents table
ALTER TABLE public.public_documents ENABLE ROW LEVEL SECURITY;

-- Create a policy to enable all authenticated users to access the documents table
CREATE POLICY "Enable SELECT to authenticated users for public documents" ON "public"."public_documents" AS permissive
  FOR SELECT TO "authenticated"
    USING (TRUE);

-- Create a storage bucket for user-uploaded documents
INSERT INTO storage.buckets(id, name, public)
  VALUES ('public_documents', 'public_documents', FALSE);

-- Create a policy to enable all authenticated users to access their own folder
CREATE POLICY "Allow authenticated users to select public documents" ON storage.buckets AS permissive
  FOR SELECT TO authenticated
    USING ((storage.foldername(name))[0] = 'public_documents');

-- Create the hearing_cases table
CREATE TABLE IF NOT EXISTS public_hearing_cases(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public_documents(id) ON DELETE CASCADE ON UPDATE CASCADE UNIQUE,
  hearing_dates text[] NOT NULL,
  hearing_officer text NOT NULL,
  landlord_name text NOT NULL,
  property_address jsonb NOT NULL,
  case_numbers text[] NOT NULL,
  decision text NOT NULL,
  reasoning text NOT NULL,
  total_relief_granted numeric NOT NULL,
  length_of_tenancy text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable row level security on the hearing_cases table
ALTER TABLE public.public_hearing_cases ENABLE ROW LEVEL SECURITY;

-- Create a policy to enable all authenticated users to access the hearing_cases table
CREATE POLICY "Enable SELECT to authenticated users for public hearing cases" ON "public"."public_hearing_cases" AS permissive
  FOR SELECT TO "authenticated"
    USING (TRUE);

-- Create the issues table
CREATE TABLE IF NOT EXISTS public_issues(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public_hearing_cases(id) ON DELETE CASCADE ON UPDATE CASCADE,
  document_id uuid NOT NULL REFERENCES public_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
  category text,
  subcategory text,
  issue_type text,
  issue_details text,
  duration text,
  tenant_evidence text[],
  tenant_citations text[],
  landlord_response text[],
  landlord_citations text[],
  landlord_evidence text[],
  decision text,
  relief_granted boolean,
  relief_description text,
  relief_amount numeric,
  relief_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable row level security on the issues table
ALTER TABLE public.public_issues ENABLE ROW LEVEL SECURITY;

-- Create a policy to enable all authenticated users to access the issues table
CREATE POLICY "Enable SELECT to authenticated users for public issues" ON "public"."public_issues" AS permissive
  FOR SELECT TO "authenticated"
    USING (TRUE);

ALTER TABLE public.issues
  DROP COLUMN landlord_counterarguments;

ALTER TABLE public.issues
  ADD COLUMN landlord_response text[];

ALTER TABLE public.issues
  ADD COLUMN tenant_citations text[];

ALTER TABLE public.issues
  ADD COLUMN landlord_citations text[];

