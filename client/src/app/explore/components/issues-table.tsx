import { DataTable } from "@/components/ui/data-table";
import { Issue } from "@/types/issue";
import { issueColumns } from "../columns/issue-columns";

export const issues: Issue[] = [
  {
    id: "728ed52f",
    category: "habitability",
    name: "Ineffective waterproofing to prevent wet or moldy walls",
    description: "The apartment is dirty and unsafe.",
    tenantEvidence: ["The apartment is dirty and unsafe."],
    landlordCounterarguments: ["The apartment is clean and safe."],
    landlordEvidence: ["The apartment is clean and safe."],
    decision: "pro-tenant",
    reliefGranted: true,
    reliefDescription: "The landlord agreed to clean the apartment.",
    reliefAmount: 100,
    reliefReason: "The tenant's health and safety are at risk.",
    duration: "1 month",
  },
  {
    id: "728ed523",
    category: "habitability",
    name: "Ineffective waterproofing to prevent wet or moldy walls",
    description: "The apartment is dirty and unsafe.",
    tenantEvidence: ["The apartment is dirty and unsafe."],
    landlordCounterarguments: ["The apartment is clean and safe."],
    landlordEvidence: ["The apartment is clean and safe."],
    decision: "pro-tenant",
    reliefGranted: true,
    reliefDescription: "The landlord agreed to clean the apartment.",
    reliefAmount: 100,
    reliefReason: "The tenant's health and safety are at risk.",
    duration: "1 month",
  },
];

export const IssuesTable = () => {
  return <DataTable columns={issueColumns} data={issues} />;
};
