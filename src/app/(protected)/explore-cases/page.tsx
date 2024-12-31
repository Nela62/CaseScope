import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { fetchAllIssues } from "@/lib/queries";
import { ExploreCasesComponent } from "./explore-cases-component";

export default async function ExploreCasesPage() {
  const supabase = await createClient();
  const queryClient = new QueryClient();

  // TODO: Low: Consider prefetching issues and case details

  await prefetchQuery(queryClient, fetchAllIssues(supabase));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ExploreCasesComponent />
    </HydrationBoundary>
  );
}
