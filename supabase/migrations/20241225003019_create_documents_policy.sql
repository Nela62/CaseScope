DROP POLICY "Allow users to select their own folder" ON storage.buckets;

CREATE POLICY "Allow users to select their own folder" ON storage.objects TO authenticated
  USING (bucket_id = 'documents'
    AND (
      SELECT
        auth.uid()::text) =(storage.foldername(name))[1])
      WITH CHECK (bucket_id = 'documents'
      AND (
        SELECT
          auth.uid()::text) =(storage.foldername(name))[1]);

