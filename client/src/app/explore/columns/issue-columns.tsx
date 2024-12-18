import { ColumnDef } from "@tanstack/react-table";
import { Issue } from "@/types/issue";

export const issueColumns: ColumnDef<Issue>[] = [
  {
    accessorKey: "category",
    header: "Category",
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
  },
  {
    accessorKey: "reliefGranted",
    header: "Relief Granted",
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

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "reliefReason",
    header: "Relief Reason",
  },
];
