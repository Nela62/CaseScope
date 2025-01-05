-- Create a policy to enable all authenticated users to access the documents table
CREATE POLICY "Enable SELECT to anonymous users for public documents" ON "public"."public_documents" AS permissive
  FOR SELECT TO "anon"
    USING (TRUE);

-- Create a policy to enable all authenticated users to access their own folder
CREATE POLICY "Allow anonymous users to select public documents" ON storage.buckets AS permissive
  FOR SELECT TO "anon"
    USING ((storage.foldername(name))[0] = 'public_documents');

-- Create a policy to enable all authenticated users to access the hearing_cases table
CREATE POLICY "Enable SELECT to anonymous users for public hearing cases" ON "public"."public_hearing_cases" AS permissive
  FOR SELECT TO "anon"
    USING (TRUE);

-- Create a policy to enable all authenticated users to access the issues table
CREATE POLICY "Enable SELECT to anonymous users for public issues" ON "public"."public_issues" AS permissive
  FOR SELECT TO "anon"
    USING (TRUE);

