import { Database } from "@/lib/supabase/database.types";
import {
  ColDef,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";

type Issue = Omit<
  Partial<Database["public"]["Tables"]["issues"]["Row"]>,
  "case_id"
> & {
  case_id: Partial<Database["public"]["Tables"]["hearing_cases"]["Row"]>;
};

type GroupData = {
  category?: string;
  subcategory?: string;
  issue_type?: string;
  landlord_name?: string;
  tenant_evidence: string[];
  landlord_evidence: string[];
  landlord_counterarguments: string[];
  pro_tenant_decisions: number;
  pro_landlord_decisions: number;
  total_relief_amount: number;
  relief_count: number;
};

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
// TODO: Low: Refactor

export const getIssues = (
  issues: Issue[],
  groupBy: string
): { data: Record<string, unknown>[]; columns: ColDef[] } => {
  if (groupBy === "None") {
    const data = issues.map((issue) => ({
      category: issue.category,
      subcategory: issue.subcategory,
      issue_type: issue.issue_type,
      issue_details: issue.issue_details,
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
      { field: "issue_details", headerName: "Issue Details", filter: true },
      { field: "duration", headerName: "Duration", filter: true },
      {
        field: "tenant_evidence",
        headerName: "Tenant Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.tenant_evidence
            ? `- ${p.data.tenant_evidence.join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_evidence",
        headerName: "Landlord Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_evidence
            ? `- ${p.data.landlord_evidence.join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_counterarguments",
        headerName: "Landlord Counterarguments",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_counterarguments
            ? `- ${p.data.landlord_counterarguments.join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      { field: "decision", headerName: "Decision", filter: true },
      { field: "relief_granted", headerName: "Relief Granted", filter: true },
      {
        field: "relief_amount",
        headerName: "Relief Amount",
        filter: true,
        valueFormatter: (params: ValueFormatterParams) =>
          `$${params.value.toLocaleString()}`,
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
  } else if (groupBy === "Category") {
    const data = issues.reduce((acc, issue) => {
      const key = issue.category;
      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = {
          category: key,
          tenant_evidence: [],
          landlord_evidence: [],
          landlord_counterarguments: [],
          pro_tenant_decisions: 0,
          pro_landlord_decisions: 0,
          total_relief_amount: 0,
          relief_count: 0,
        };
      }

      const group = acc[key];

      // Append arrays
      if (issue.tenant_evidence)
        group.tenant_evidence.push(...issue.tenant_evidence);
      if (issue.landlord_evidence)
        group.landlord_evidence.push(...issue.landlord_evidence);
      if (issue.landlord_counterarguments)
        group.landlord_counterarguments.push(
          ...issue.landlord_counterarguments
        );

      // Count decisions
      if (issue.decision === "pro-tenant") group.pro_tenant_decisions++;
      if (issue.decision === "pro-landlord") group.pro_landlord_decisions++;

      // Sum relief amounts
      if (issue.relief_amount) {
        group.total_relief_amount += issue.relief_amount;
        group.relief_count++;
      }

      return acc;
    }, {} as Record<string, GroupData>);

    const columns = [
      { field: "category", headerName: "Category", filter: true },
      {
        field: "average_relief_amount",
        headerName: "Average Relief Amount",
        filter: true,
        valueFormatter: (params: ValueFormatterParams) =>
          `$${params.value.toLocaleString()}`,
        valueGetter: (p: ValueGetterParams) =>
          p.data.relief_count > 0
            ? Number(p.data.total_relief_amount / p.data.relief_count)
            : 0,
      },
      {
        field: "decision",
        headerName: "Decision",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          `Pro-Tenant: ${p.data.pro_tenant_decisions}\nPro-Landlord: ${p.data.pro_landlord_decisions}`,
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      // TODO: High: I don't feel like these are very useful, especially in categories group since there can be so many
      {
        field: "tenant_evidence",
        headerName: "Tenant Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.tenant_evidence.length > 0
            ? `- ${[...new Set(p.data.tenant_evidence)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_evidence",
        headerName: "Landlord Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_evidence.length > 0
            ? `- ${[...new Set(p.data.landlord_evidence)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_counterarguments",
        headerName: "Landlord Counterarguments",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_counterarguments.length > 0
            ? `- ${[...new Set(p.data.landlord_counterarguments)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
    ];

    console.log(data);

    return {
      data: Object.values(data),
      columns,
    };
  } else if (groupBy === "Subcategory") {
    const data = issues.reduce((acc, issue) => {
      const key = issue.subcategory;
      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = {
          category: issue.category || "",
          subcategory: key,
          tenant_evidence: [],
          landlord_evidence: [],
          landlord_counterarguments: [],
          pro_tenant_decisions: 0,
          pro_landlord_decisions: 0,
          total_relief_amount: 0,
          relief_count: 0,
        };
      }

      const group = acc[key];

      // Append arrays
      if (issue.tenant_evidence)
        group.tenant_evidence.push(...issue.tenant_evidence);
      if (issue.landlord_evidence)
        group.landlord_evidence.push(...issue.landlord_evidence);
      if (issue.landlord_counterarguments)
        group.landlord_counterarguments.push(
          ...issue.landlord_counterarguments
        );

      // Count decisions
      if (issue.decision === "pro-tenant") group.pro_tenant_decisions++;
      if (issue.decision === "pro-landlord") group.pro_landlord_decisions++;

      // Sum relief amounts
      if (issue.relief_amount) {
        group.total_relief_amount += issue.relief_amount;
        group.relief_count++;
      }

      return acc;
    }, {} as Record<string, GroupData>);

    const columns = [
      { field: "category", headerName: "Category", filter: true },
      { field: "subcategory", headerName: "Subcategory", filter: true },
      {
        field: "average_relief_amount",
        headerName: "Average Relief Amount",
        filter: true,
        valueFormatter: (params: ValueFormatterParams) =>
          `$${params.value.toLocaleString()}`,
        valueGetter: (p: ValueGetterParams) =>
          p.data.relief_count > 0
            ? Number(p.data.total_relief_amount / p.data.relief_count)
            : 0,
      },
      {
        field: "decision",
        headerName: "Decision",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          `Pro-Tenant: ${p.data.pro_tenant_decisions}\nPro-Landlord: ${p.data.pro_landlord_decisions}`,
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "tenant_evidence",
        headerName: "Tenant Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.tenant_evidence.length > 0
            ? `- ${[...new Set(p.data.tenant_evidence)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_evidence",
        headerName: "Landlord Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_evidence.length > 0
            ? `- ${[...new Set(p.data.landlord_evidence)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_counterarguments",
        headerName: "Landlord Counterarguments",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_counterarguments.length > 0
            ? `- ${[...new Set(p.data.landlord_counterarguments)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
    ];

    return {
      data: Object.values(data),
      columns,
    };
  } else if (groupBy === "Issue Type") {
    const data = issues.reduce((acc, issue) => {
      const key = issue.issue_type;
      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = {
          category: issue.category || "",
          subcategory: issue.subcategory || "",
          issue_type: key,
          tenant_evidence: [],
          landlord_evidence: [],
          landlord_counterarguments: [],
          pro_tenant_decisions: 0,
          pro_landlord_decisions: 0,
          total_relief_amount: 0,
          relief_count: 0,
        };
      }

      const group = acc[key];

      // Append arrays
      if (issue.tenant_evidence)
        group.tenant_evidence.push(...issue.tenant_evidence);
      if (issue.landlord_evidence)
        group.landlord_evidence.push(...issue.landlord_evidence);
      if (issue.landlord_counterarguments)
        group.landlord_counterarguments.push(
          ...issue.landlord_counterarguments
        );

      // Count decisions
      if (issue.decision === "pro-tenant") group.pro_tenant_decisions++;
      if (issue.decision === "pro-landlord") group.pro_landlord_decisions++;

      // Sum relief amounts
      if (issue.relief_amount) {
        group.total_relief_amount += issue.relief_amount;
        group.relief_count++;
      }

      return acc;
    }, {} as Record<string, GroupData>);

    const columns = [
      { field: "category", headerName: "Category", filter: true },
      { field: "subcategory", headerName: "Subcategory", filter: true },
      { field: "issue_type", headerName: "Issue Type", filter: true },
      {
        field: "average_relief_amount",
        headerName: "Average Relief Amount",
        filter: true,
        valueFormatter: (params: ValueFormatterParams) =>
          `$${params.value.toLocaleString()}`,
        valueGetter: (p: ValueGetterParams) =>
          p.data.relief_count > 0
            ? Number(p.data.total_relief_amount / p.data.relief_count)
            : 0,
      },
      {
        field: "decision",
        headerName: "Decision",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          `Pro-Tenant: ${p.data.pro_tenant_decisions}\nPro-Landlord: ${p.data.pro_landlord_decisions}`,
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "tenant_evidence",
        headerName: "Tenant Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.tenant_evidence.length > 0
            ? `- ${[...new Set(p.data.tenant_evidence)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_evidence",
        headerName: "Landlord Evidence",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_evidence.length > 0
            ? `- ${[...new Set(p.data.landlord_evidence)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
      {
        field: "landlord_counterarguments",
        headerName: "Landlord Counterarguments",
        filter: true,
        valueGetter: (p: ValueGetterParams) =>
          p.data.landlord_counterarguments.length > 0
            ? `- ${[...new Set(p.data.landlord_counterarguments)].join("\n- ")}`
            : "",
        cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
      },
    ];

    return {
      data: Object.values(data),
      columns,
    };
  }
  // else if (groupBy === "Landlord") {
  //   // TODO: Medium: Add
  //   const data = issues.reduce((acc, issue) => {
  //     const key = issue.case_id.landlord_name;
  //     if (!key) return acc;

  //     if (!acc[key]) {
  //       acc[key] = {
  //         landlord_name: key,
  //         tenant_evidence: [],
  //         landlord_evidence: [],
  //         landlord_counterarguments: [],
  //         pro_tenant_decisions: 0,
  //         pro_landlord_decisions: 0,
  //         total_relief_amount: 0,
  //         relief_count: 0,
  //       };
  //     }

  //     const group = acc[key];

  //     // Append arrays
  //     if (issue.tenant_evidence)
  //       group.tenant_evidence.push(...issue.tenant_evidence);
  //     if (issue.landlord_evidence)
  //       group.landlord_evidence.push(...issue.landlord_evidence);
  //     if (issue.landlord_counterarguments)
  //       group.landlord_counterarguments.push(
  //         ...issue.landlord_counterarguments
  //       );

  //     // Count decisions
  //     if (issue.decision === "pro-tenant") group.pro_tenant_decisions++;
  //     if (issue.decision === "pro-landlord") group.pro_landlord_decisions++;

  //     // Sum relief amounts
  //     if (issue.relief_amount) {
  //       group.total_relief_amount += issue.relief_amount;
  //       group.relief_count++;
  //     }

  //     return acc;
  //   }, {} as Record<string, unknown>);

  //   const columns = [
  //     { field: "landlord_name", headerName: "Landlord Name", filter: true },
  //     {
  //       field: "average_relief_amount",
  //       headerName: "Average Relief Amount",
  //       filter: true,
  //       valueFormatter: (params: ValueFormatterParams) =>
  //         `$${params.value.toLocaleString()}`,
  //       valueGetter: (p: ValueGetterParams) =>
  //         p.data.relief_count > 0
  //           ? Number(p.data.total_relief_amount / p.data.relief_count)
  //           : 0,
  //     },
  //     {
  //       field: "decision",
  //       headerName: "Decision",
  //       filter: true,
  //       valueGetter: (p: ValueGetterParams) =>
  //         `Pro-Tenant: ${p.data.pro_tenant_decisions}\nPro-Landlord: ${p.data.pro_landlord_decisions}`,
  //       cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
  //     },
  //     // TODO: High: I don't feel like these are very useful, especially in categories group since there can be so many
  //     {
  //       field: "tenant_evidence",
  //       headerName: "Tenant Evidence",
  //       filter: true,
  //       valueGetter: (p: ValueGetterParams) =>
  //         p.data.tenant_evidence.length > 0
  //           ? `- ${[...new Set(p.data.tenant_evidence)].join("\n- ")}`
  //           : "",
  //       cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
  //     },
  //     {
  //       field: "landlord_evidence",
  //       headerName: "Landlord Evidence",
  //       filter: true,
  //       valueGetter: (p: ValueGetterParams) =>
  //         p.data.landlord_evidence.length > 0
  //           ? `- ${[...new Set(p.data.landlord_evidence)].join("\n- ")}`
  //           : "",
  //       cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
  //     },
  //     {
  //       field: "landlord_counterarguments",
  //       headerName: "Landlord Counterarguments",
  //       filter: true,
  //       valueGetter: (p: ValueGetterParams) =>
  //         p.data.landlord_counterarguments.length > 0
  //           ? `- ${[...new Set(p.data.landlord_counterarguments)].join("\n- ")}`
  //           : "",
  //       cellStyle: { whiteSpace: "pre", textWrap: "wrap" },
  //     },
  //   ];

  //   console.log(data);

  //   return {
  //     data: Object.values(data),
  //     columns,
  //   };
  // }

  return { data: [], columns: [] };
};
