ALTER TABLE documents
  DROP COLUMN url;

ALTER TABLE documents
  ADD CONSTRAINT documents_name_user_id_key UNIQUE (name, user_id);

