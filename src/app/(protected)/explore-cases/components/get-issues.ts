import { Database } from "@/lib/supabase/database.types";
import { ColDef, ValueFormatterParams } from "ag-grid-community";

type Issue = Database["public"]["Tables"]["issues"]["Row"];

// TODO: Low: Better filtering of address
function displayAddress(addressObj: {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}) {
  return `${addressObj.street}, ${addressObj.city}, ${addressObj.state}, ${
    addressObj.country
  } ${addressObj.zip || ""}`;
}

export const getIssues = (
  issues: Issue[],
  groupBy: string
): { data: Record<string, unknown>[]; columns: ColDef[] } => {
  if (groupBy === "None") {
    const data = issues.map((issue) => ({
      category: issue.category,
      subcategory: issue.subcategory,
      issue_type: issue.issue_type,
      duration: issue.duration,
      tenant_evidence: issue.tenant_evidence,
      landlord_evidence: issue.landlord_evidence,
      landlord_counterarguments: issue.landlord_counterarguments,
      decision: issue.decision,
      relief_granted: issue.relief_granted,
      relief_amount: issue.relief_amount,
      relief_reason: issue.relief_reason,
      relief_description: issue.relief_description,
      // TODO: High: Adjust the type to contain landlord name and property address
      landlord_name: issue.case_id.landlord_name,
      property_address: issue.case_id.property_address,
    }));

    const columns = [
      { field: "category", headerName: "Category", filter: true },
      { field: "subcategory", headerName: "Subcategory", filter: true },
      { field: "issue_type", headerName: "Issue Type", filter: true },
      { field: "duration", headerName: "Duration", filter: true },
      { field: "tenant_evidence", headerName: "Tenant Evidence", filter: true },
      {
        field: "landlord_evidence",
        headerName: "Landlord Evidence",
        filter: true,
      },
      {
        field: "landlord_counterarguments",
        headerName: "Landlord Counterarguments",
        filter: true,
      },
      { field: "decision", headerName: "Decision", filter: true },
      { field: "relief_granted", headerName: "Relief Granted", filter: true },
      {
        field: "relief_amount",
        headerName: "Relief Amount",
        filter: true,
        valueFormatter: (params: ValueFormatterParams) => `$${params.value}`,
      },
      { field: "relief_reason", headerName: "Relief Reason", filter: true },
      {
        field: "property_address",
        headerName: "Property Address",
        filter: true,
        valueFormatter: (params: ValueFormatterParams) =>
          displayAddress(params.value),
      },
      { field: "landlord_name", headerName: "Landlord Name", filter: true },
    ];

    return { data, columns };
  }
  return { data: [], columns: [] };
};
