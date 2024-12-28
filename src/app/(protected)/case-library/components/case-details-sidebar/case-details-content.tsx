import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCaseDetails } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { format } from "date-fns";

export const CaseDetailsContent = () => {
  const supabase = createClient();
  const { selectedCaseId } = useAppStore((state) => state);
  const { data: caseDetails, isLoading } = useQuery(
    fetchCaseDetails(supabase, selectedCaseId ?? ""),
    { enabled: !!selectedCaseId }
  );

  const displayValue = (value: unknown) => {
    if (typeof value === "object") {
      return Object.entries(value as object).map(([addrKey, addrValue]) => (
        <p key={addrKey}>{String(addrValue)}</p>
      ));
    } else if (Array.isArray(value)) {
      return value.map((item, i) => <p key={i}>{String(item)}</p>);
    } else if (typeof value === "number") {
      // TODO: Low: May not work for all numbers
      // TODO: Low format the number
      return <p>${String(value)}</p>;
    } else if (value instanceof Date) {
      // TODO: Low: The date display doesn't work for created at
      return <p>{format(value, "MM/dd/yyyy")}</p>;
    }
    return <p>{String(value)}</p>;
  };

  if (!caseDetails || isLoading) return null;

  return (
    // <div className="h-full flex flex-col">
    <ScrollArea className="-mx-4 sm:-mx-6 lg:-mx-8 h-full">
      {/* <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"> */}
      <div className="w-full align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <tbody className="divide-y divide-gray-200">
            {Object.entries(caseDetails)
              .filter(([key]) => key !== "id")
              .map(([key, value]) => (
                <tr key={key}>
                  <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                    {/* TODO: Low: of shouldn't be capitalized */}
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {isLoading ? (
                      <Skeleton className="h-4 w-full" />
                    ) : (
                      displayValue(value)
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {/* </div> */}
      </div>
    </ScrollArea>
    // </div>
  );
};
