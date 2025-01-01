"use client";

// import { Tabs, TabsContent } from "@/components/ui/tabs";
// import { ExploreCasesTabs } from "./components/explore-cases-tabs";
import { IssuesTable } from "./components/issues-table";

// const tabs = ["All", "By Landlord"];

export const ExploreCasesComponent = () => {
  return (
    <div className="h-full space-x-4 md:space-x-6 lg:space-x-8">
      <div className="h-full py-6 space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Explore Cases
            </h2>
          </div>
          <div className="mt-4 flex gap-4 md:mt-0 md:ml-4">
            {/* TODO: Low: Add export button */}
          </div>
        </div>
        <IssuesTable />
        {/* <Tabs defaultValue={tabs[0]}>
          <ExploreCasesTabs tabs={tabs} />
          <TabsContent value="All">
            <IssuesTable />
          </TabsContent>
          <TabsContent value="By Landlord"></TabsContent>
        </Tabs> */}
      </div>
    </div>
  );
};
