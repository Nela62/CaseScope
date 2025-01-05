-- Create a policy to enable all authenticated users to access their own folder
CREATE POLICY "Allow authenticated users to select public documents in storage" ON storage.buckets
  FOR SELECT TO authenticated, anon
    USING ((storage.foldername(name))[0] = 'public_documents');

