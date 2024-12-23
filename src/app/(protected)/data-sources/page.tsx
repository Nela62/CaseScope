import { redirect } from "next/navigation";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { DataSourcesComponent } from "./data-sources-component";
import { createClient } from "@/lib/supabase/server";
import { fetchAllDocuments } from "@/lib/queries";

export default async function DataSourcesPage() {
  const supabase = await createClient();
  const queryClient = new QueryClient();

  await prefetchQuery(queryClient, fetchAllDocuments(supabase));

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DataSourcesComponent />
    </HydrationBoundary>
  );
}
