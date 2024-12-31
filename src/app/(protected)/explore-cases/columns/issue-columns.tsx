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

// type Issue = Database["public"]["Tables"]["issues"]["Row"];

export type Issue = {
  category: string;
  subcategory: string;
  tenant_evidence: string[];
  landlord_evidence: string[];
  landlord_counterarguments: string[];
  decision: string;
  relief_granted: boolean;
  relief_description: string;
  relief_amount: number;
  relief_reason: string;
  property_address: string;
  landlord_name: string;
};

export const issueColumns: ColumnDef<Issue>[] = [
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
    accessorKey: "issue_details",
    header: "Issue Details",
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("duration")}</div>;
    },
  },
  {
    accessorKey: "tenant_evidence",
    header: "Tenant Evidence",
  },
  {
    accessorKey: "landlord_counterarguments",
    header: "Landlord Counterarguments",
  },
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
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("relief_granted") ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "relief_description",
    header: "Relief Description",
  },
  {
    accessorKey: "relief_amount",
    header: "Relief Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("relief_amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "relief_reason",
    header: "Relief Reason",
  },
  {
    accessorKey: "property_address",
    header: "Property Address",
  },
  {
    accessorKey: "landlord_name",
    header: "Landlord Name",
  },
];
