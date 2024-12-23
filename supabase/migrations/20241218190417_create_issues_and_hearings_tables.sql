-- Create the hearing_cases table
CREATE TABLE IF NOT EXISTS hearing_cases(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
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
ALTER TABLE public.hearing_cases ENABLE ROW LEVEL SECURITY;

-- Create a policy to enable all authenticated users to access the hearing_cases table
CREATE POLICY "Enable ALL to authenticated users based on user id" ON "public"."hearing_cases" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

-- Create the issues table
CREATE TABLE IF NOT EXISTS issues(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  case_id uuid NOT NULL REFERENCES hearing_cases(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable row level security on the issues table
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create a policy to enable all authenticated users to access the issues table
CREATE POLICY "Enable ALL to authenticated users based on user id" ON "public"."issues" TO "authenticated"
  USING (((
    SELECT
      "auth"."uid"() AS "uid") = "user_id"))
      WITH CHECK (((
        SELECT
          "auth"."uid"() AS "uid") = "user_id"));

-- Create the storage bucket for user-uploaded documents
INSERT INTO storage.buckets(id, name, public)
  VALUES ('documents', 'documents', FALSE);

-- Create a policy to enable all authenticated users to access the documents bucket
CREATE POLICY "Give authenticated users access to SEC Filings" ON storage.objects
  FOR SELECT TO authenticated
    USING (bucket_id = 'documents');

-- Create a policy to enable all authenticated users to access their own folder
CREATE POLICY "Allow users to select their own folder" ON storage.buckets TO authenticated
  USING ((storage.foldername(name))[1] =(
    SELECT
      auth.uid()::text))
    WITH CHECK ((storage.foldername(name))[1] =(
      SELECT
        auth.uid()::text));

