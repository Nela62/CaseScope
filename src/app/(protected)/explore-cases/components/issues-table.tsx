import { DataTable } from "@/components/ui/data-table";
import { issueColumns } from "../columns/issue-columns";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllIssues } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

export const IssuesTable = () => {
  const supabase = createClient();
  const { data: issues, error } = useQuery(fetchAllIssues(supabase));

  if (error) {
    console.error(error);
    return null;
  }

  // TODO: Low: The x overflow scroll bar is overflowing
  // TODO: Low: Use a different table UI
  // TODO: Low: No padding after pagination
  // TODO: Low: Only the table should scroll, not the entire page

  return issues ? (
    <DataTable columns={issueColumns} data={issues} />
  ) : (
    <Skeleton className="h-full" />
  );
};
