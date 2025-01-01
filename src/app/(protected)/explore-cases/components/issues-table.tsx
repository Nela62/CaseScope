import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { fetchAllIssues } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { AGTable } from "@/components/ui/ag-table";
import RadioGroupCardsRow from "@/components/ui/radio-group-cards-row";

export const IssuesTable = () => {
  const supabase = createClient();
  const { data: issues, error } = useQuery(fetchAllIssues(supabase));

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div className="space-y-6">
      <RadioGroupCardsRow
        options={["None", "Category", "Subcategory", "Issue Type", "Landlord"]}
        label="Group By"
        onChange={(option: string) => {
          console.log(option);
        }}
      />

      {issues ? <AGTable /> : <Skeleton className="h-full" />}
    </div>
  );
};
