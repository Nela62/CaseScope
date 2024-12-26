import { useAppStore } from "@/providers/app-store-provider";
import { CaseDetailsSidebarTabs } from "./tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CaseDetailsContent } from "./case-details-content";

const tabs = ["Case Details", "Issues", "PDF"];

export const CaseDetailsSidebar = () => {
  const { selectedCaseId } = useAppStore((state) => state);

  return (
    <div className="pt-6 h-full">
      <Tabs defaultValue={tabs[0]} className="flex flex-col h-full">
        <div className="flex-none">
          <CaseDetailsSidebarTabs tabs={tabs} />
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent
            value="Case Details"
            className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <CaseDetailsContent />
          </TabsContent>
          <TabsContent value="Issues">
            <p>Issues for {selectedCaseId}</p>
          </TabsContent>
          <TabsContent value="PDF">
            <p>PDF for {selectedCaseId}</p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
