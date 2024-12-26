import { Skeleton } from "@/components/ui/skeleton";
import { fetchCaseDetails } from "@/lib/queries";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/providers/app-store-provider";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

export const IssuesContent = () => {
  const supabase = createClient();
  const { selectedCaseId } = useAppStore((state) => state);
  const { data: caseDetails, isLoading } = useQuery(
    fetchCaseDetails(supabase, selectedCaseId ?? ""),
    { enabled: !!selectedCaseId }
  );

  const people = [
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walton@example.com",
      role: "Member",
    },
    {
      name: "Lindsay Walton",
      title: "Front-end Developer",
      email: "lindsay.walt@example.com",
      role: "Member",
    },
    // More people...
  ];

  return !caseDetails || isLoading ? (
    <div>
      <Skeleton className="h-4 w-full" />
    </div>
  ) : (
    <div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
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
                </thead> */}
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
            </table>
          </div>
        </div>
      </div>
      {/* {Object.entries(caseDetails).map(([key, value]) => {
          if (key === "property_address" && typeof value === "object") {
            return (
              <div key={key} className="grid grid-cols-[200px_1fr] gap-x-4">
                <p className="font-semibold text-gray-900">
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <div>
                  {Object.entries(value as object).map(
                    ([addrKey, addrValue]) => (
                      <p key={addrKey}>{String(addrValue)}</p>
                    )
                  )}
                </div>
              </div>
            );
          }

          if (Array.isArray(value)) {
            return (
              <div key={key} className="grid grid-cols-[200px_1fr] gap-x-4">
                <p className="font-semibold text-gray-900">
                  {key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <div>
                  {value.map((item, i) => (
                    <p key={i}>{String(item)}</p>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={key} className="grid grid-cols-[200px_1fr] gap-x-4">
              <p className="font-semibold text-gray-900">
                {key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              <p>{String(value)}</p>
            </div>
          );
        })} */}
    </div>
  );
};
