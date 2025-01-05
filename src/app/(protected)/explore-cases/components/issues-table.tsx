import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllIssues, fetchAllPublicIssues } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { AGTable } from "@/components/ui/ag-table";
import RadioGroupCardsRow from "@/components/ui/radio-group-cards-row";
import { useMemo, useState } from "react";
import { getIssues } from "./get-issues";
import { useUser } from "@/providers/user-provider";

export const groupByOptions = [
  "None",
  "Category",
  "Subcategory",
  "Issue Type",
  // "Landlord",
];

export const IssuesTable = () => {
  const supabase = createClient();
  const { isAnonymous } = useUser();

  const fetchFn = isAnonymous
    ? fetchAllPublicIssues(supabase)
    : fetchAllIssues(supabase);

  const { data: issues, error } = useQuery(fetchFn);
  const [groupBy, setGroupBy] = useState("None");

  const { data, columns } = useMemo(
    () => getIssues(issues || [], groupBy),
    [issues, groupBy]
  );

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <>
      <RadioGroupCardsRow
        options={groupByOptions}
        label="Group By"
        selectedOption={groupBy}
        onChange={(option: string) => {
          setGroupBy(option);
        }}
      />

      {issues ? (
        <div className="flex-1">
          <AGTable key={groupBy} data={data} columns={columns} />
        </div>
      ) : (
        <Skeleton className="h-full" />
      )}
    </>
  );
};
