import { ExtractorType, Extractor } from "@/types/extractor";
import * as caseDetails from "./case-details";
import * as tenantIssues from "./tenant-issues";

const extractors: Record<ExtractorType, Extractor> = {
  [ExtractorType.CASE_DETAILS]: {
    promptTemplate: caseDetails.promptTemplate,
    jsonSchema: caseDetails.jsonSchema,
  },
  [ExtractorType.TENANT_ISSUES]: {
    promptTemplate: tenantIssues.promptTemplate,
    jsonSchema: tenantIssues.jsonSchema,
  },
};

export function getExtractor(type: ExtractorType): Extractor {
  const extractor = extractors[type];
  if (!extractor) {
    throw new Error(`Unknown extractor type: ${type}`);
  }
  return extractor;
}
