import { DisplayValue } from "@/components/display-value";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchCaseDetailsByDocumentId,
  fetchPublicCaseDetailsByDocumentId,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useUser } from "@/providers/user-provider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const CaseDetailsContent = () => {
  const supabase = createClient();
  const { isAnonymous } = useUser();
  const { selectedCaseId } = useAppStore((state) => state);

  const fetchFn = isAnonymous
    ? fetchPublicCaseDetailsByDocumentId(supabase, selectedCaseId ?? "")
    : fetchCaseDetailsByDocumentId(supabase, selectedCaseId ?? "");

  const { data: caseDetails, isLoading } = useQuery(fetchFn, {
    enabled: !!selectedCaseId,
  });

  if (!caseDetails || isLoading) return null;

  return (
    <ScrollArea className="-mx-4 sm:-mx-6 lg:-mx-8 h-full">
      <div className="w-full align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          <tbody className="divide-y divide-gray-200">
            {Object.entries(caseDetails)
              .filter(([key]) => key !== "id" && key !== "created_at")
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
                      <DisplayValue value={value} />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
};
