"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filters } from "./components/filters";
import { CasesTable } from "./components/cases-table";
import { IssuesTable } from "./components/issues-table";

export default function ExplorePage() {
  return (
    <div className="flex h-full">
      <Filters />
      <div className="flex-1 py-4 px-4">
        <Tabs defaultValue="cases">
          <TabsList className="mb-4">
            <TabsTrigger value="aggregated">Aggregated</TabsTrigger>
            <TabsTrigger value="cases">Cases</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          <TabsContent value="cases">
            <CasesTable />
          </TabsContent>
          <TabsContent value="aggregated">Aggregated</TabsContent>
          <TabsContent value="issues">
            <IssuesTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
