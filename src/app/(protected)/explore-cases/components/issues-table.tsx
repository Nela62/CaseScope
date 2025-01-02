import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllIssues } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { AGTable } from "@/components/ui/ag-table";
import RadioGroupCardsRow from "@/components/ui/radio-group-cards-row";
import { useMemo, useState } from "react";
import { getIssues } from "./get-issues";

const groupByOptions = [
  "None",
  "Category",
  "Subcategory",
  "Issue Type",
  "Landlord",
];

export const IssuesTable = () => {
  const supabase = createClient();
  const { data: issues, error } = useQuery(fetchAllIssues(supabase));
  const [groupBy, setGroupBy] = useState("None");

  // TODO: High: Fix the type
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
          <AGTable data={data} columns={columns} />
        </div>
      ) : (
        <Skeleton className="h-full" />
      )}
    </>
  );
};
