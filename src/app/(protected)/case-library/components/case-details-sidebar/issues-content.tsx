import { DisplayValue } from "@/components/display-value";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchIssuesByDocumentId,
  fetchPublicIssuesByDocumentId,
} from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useUser } from "@/providers/user-provider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const IssuesContent = () => {
  const supabase = createClient();
  const { isAnonymous } = useUser();
  const { selectedCaseId } = useAppStore((state) => state);

  const fetchFn = isAnonymous
    ? fetchPublicIssuesByDocumentId(supabase, selectedCaseId ?? "")
    : fetchIssuesByDocumentId(supabase, selectedCaseId ?? "");

  const { data: issues, isLoading } = useQuery(fetchFn, {
    enabled: !!selectedCaseId,
  });

  // TODO: High: Y-padding/margin is too much
  // TODO: High: Accordion triggers need more emphasis
  return (
    <ScrollArea className="-mx-4 sm:-mx-6 lg:-mx-8 h-full">
      <div className="w-full align-middle sm:px-6 lg:px-8">
        <Accordion type="multiple">
          {issues?.map((issue) => (
            <AccordionItem value={issue.id} key={issue.id}>
              <AccordionTrigger className="">
                {isLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : issue.issue_type ? (
                  issue.issue_type.charAt(0).toUpperCase() +
                  issue.issue_type.slice(1)
                ) : (
                  "Issue"
                )}
              </AccordionTrigger>
              <AccordionContent>
                <table className="min-w-full divide-y divide-gray-300">
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(issue)
                      .filter(
                        ([key, value]) =>
                          key !== "id" &&
                          key !== "document_id" &&
                          key !== "created_at" &&
                          value
                      )
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {/* <table className="min-w-full divide-y divide-gray-300">
              {/* <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead> 
              <tbody className="divide-y divide-gray-200">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0">
                      {person.name}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {person.title}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {person.email}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {person.role}
                    </td>
                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
      </div>
    </ScrollArea>
  );
};
