export type IssueCategory =
  | "illegal rent increase"
  | "habitability"
  | "maintenance"
  | "code violations"
  | "loss of or reduced housing services"
  | "other";

export type Issue = {
  id: string;
  category: IssueCategory;
  name: string;
  description: string;
  duration: string | null;
  tenantEvidence: string[];
  landlordCounterarguments: string[];
  landlordEvidence: string[];
  decision: "pro-tenant" | "pro-landlord" | "neutral";
  reliefGranted: boolean;
  reliefDescription: string | null;
  reliefAmount: number | null;
  reliefReason: string | null;
};
