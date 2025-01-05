import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { CaseLibraryComponent } from "./case-library-component";
import { createClient } from "@/lib/supabase/server";
import { fetchAllDocuments, fetchAllPublicDocuments } from "@/lib/queries";

export default async function CaseLibraryPage() {
  const supabase = await createClient();
  const queryClient = new QueryClient();

  // TODO: Low: Consider prefetching issues and case details

  await prefetchQuery(queryClient, fetchAllDocuments(supabase));
  await prefetchQuery(queryClient, fetchAllPublicDocuments(supabase));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CaseLibraryComponent />
    </HydrationBoundary>
  );
}
