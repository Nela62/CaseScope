import { ColumnDef } from "@tanstack/react-table";
// import { Issue } from "@/types/issue";

// case_id(
//   id,
//   hearing_dates,
//   hearing_officer,
//   landlord_name,
//   property_address,
//   case_numbers,
//   decision,
//   reasoning,
//   total_relief_granted,
//   length_of_tenancy,
//   created_at
// ),

export type AggregatedIssue = {
  issue_type: string;
  category: string;
  subcategory: string;
  tenant_evidence: string[];
  landlord_evidence: string[];
  landlord_counterarguments: string[];
  pro_tenant_decisions: number;
  pro_landlord_decisions: number;
  total_relief_amount: number;
  relief_count: number;
};

export const issueTypeColumns: ColumnDef<AggregatedIssue>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("category")}</div>;
    },
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
  },
  {
    accessorKey: "issue_type",
    header: "Issue Type",
  },
  {
    accessorKey: "tenant_evidence",
    header: "Tenant Evidence",
  },
  // {
  //   accessorKey: "landlord_counterarguments",
  //   header: "Landlord Counterarguments",
  // },
  {
    accessorKey: "landlord_evidence",
    header: "Landlord Evidence",
  },
  {
    accessorKey: "decision",
    header: "Decision",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("decision")}</div>;
    },
  },
  {
    accessorKey: "relief_granted",
    header: "Relief Granted",
  },

  {
    accessorKey: "average_relief_amount",
    header: "Average Relief Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("average_relief_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
];
