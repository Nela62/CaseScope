export enum ExtractorType {
  CASE_DETAILS = "case-details",
  TENANT_ISSUES = "tenant-issues",
}

export function isValidExtractorType(value: string): boolean {
  return (Object.values(ExtractorType) as string[]).includes(value);
}

export interface Extractor {
  name: string;
  promptTemplate: string;
  jsonSchema: object;
}
