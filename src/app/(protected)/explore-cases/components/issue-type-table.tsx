import { DataTable } from "@/components/ui/data-table";
import { issueTypeColumns } from "../columns/aggregated-columns";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllIssues } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export const IssueTypeTable = () => {
  const supabase = createClient();
  const { data: rawIssues, error } = useQuery(fetchAllIssues(supabase));

  if (error) {
    console.error(error);
    return null;
  }

  const groupedIssues = rawIssues?.reduce((acc, issue) => {
    const key = issue.issue_type;
    if (!key) return acc;

    if (!acc[key]) {
      acc[key] = {
        issue_type: key,
        category: issue.category,
        subcategory: issue.subcategory,
        tenant_evidence: [],
        landlord_evidence: [],
        landlord_counterarguments: [],
        pro_tenant_decisions: 0,
        pro_landlord_decisions: 0,
        total_relief_amount: 0,
        relief_count: 0,
      };
    }

    // Append arrays
    if (issue.tenant_evidence)
      acc[key].tenant_evidence.push(issue.tenant_evidence);
    if (issue.landlord_evidence)
      acc[key].landlord_evidence.push(issue.landlord_evidence);
    if (issue.landlord_counterarguments)
      acc[key].landlord_counterarguments.push(issue.landlord_counterarguments);

    // Count decisions
    if (issue.decision === "pro-tenant") acc[key].pro_tenant_decisions++;
    if (issue.decision === "pro-landlord") acc[key].pro_landlord_decisions++;

    // Sum relief amounts
    if (issue.relief_amount) {
      acc[key].total_relief_amount += issue.relief_amount;
      acc[key].relief_count++;
    }

    return acc;
  }, {} as Record<string, unknown>);

  // console.log(groupedIssues);

  const processedIssues = Object.entries(groupedIssues || {}).map(
    ([key, issue]) => ({
      ...issue,
      issue_type: key,
      tenant_evidence: issue.tenant_evidence.join(", "),
      landlord_evidence: issue.landlord_evidence.join(", "),
      landlord_counterarguments: issue.landlord_counterarguments.join(", "),
      decision: `Pro-Tenant: ${issue.pro_tenant_decisions}, Pro-Landlord: ${issue.pro_landlord_decisions}`,
      relief_granted: `Yes: ${issue.pro_tenant_decisions}, No: ${issue.pro_landlord_decisions}`,
      average_relief_amount:
        issue.relief_count > 0
          ? Number(issue.total_relief_amount / issue.relief_count)
          : 0,
    })
  );

  console.log(processedIssues);

  return rawIssues ? (
    <DataTable columns={issueTypeColumns} data={processedIssues} />
  ) : (
    <Skeleton className="h-full" />
  );
};
