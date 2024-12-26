ALTER TABLE documents
  DROP COLUMN url;

ALTER TABLE documents
  ADD CONSTRAINT documents_name_user_id_key UNIQUE (name, user_id);

ALTER TABLE issues
  ADD COLUMN document_id uuid REFERENCES documents(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE issues
  ADD COLUMN category text;

ALTER TABLE issues
  ADD COLUMN name text;

ALTER TABLE issues
  ADD COLUMN issue_details text;

ALTER TABLE issues
  ADD COLUMN duration text;

ALTER TABLE issues
  ADD COLUMN tenant_evidence text[];

ALTER TABLE issues
  ADD COLUMN landlord_counterarguments text[];

ALTER TABLE issues
  ADD COLUMN landlord_evidence text[];

ALTER TABLE issues
  ADD COLUMN decision text;

ALTER TABLE issues
  ADD COLUMN relief_granted boolean;

ALTER TABLE issues
  ADD COLUMN relief_description text;

ALTER TABLE issues
  ADD COLUMN relief_amount numeric;

ALTER TABLE issues
  ADD COLUMN relief_reason text;

ALTER TABLE hearing_cases
  ADD CONSTRAINT hearing_cases_document_id_key UNIQUE (document_id);

ALTER TABLE issues
  ADD CONSTRAINT issues_document_id_key UNIQUE (document_id);

