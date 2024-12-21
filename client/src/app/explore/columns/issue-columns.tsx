import { ColumnDef } from "@tanstack/react-table";
import { Issue } from "@/types/issue";

export const issueColumns: ColumnDef<Issue>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("category")}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("duration")}</div>;
    },
  },
  {
    accessorKey: "tenantEvidence",
    header: "Tenant Evidence",
  },
  {
    accessorKey: "landlordCounterarguments",
    header: "Landlord Counterarguments",
  },
  {
    accessorKey: "landlordEvidence",
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
    accessorKey: "reliefGranted",
    header: "Relief Granted",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.getValue("reliefGranted") ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "reliefDescription",
    header: "Relief Description",
  },
  {
    accessorKey: "reliefAmount",
    header: "Relief Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("reliefAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "reliefReason",
    header: "Relief Reason",
  },
];
