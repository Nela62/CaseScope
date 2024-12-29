import { CaseDetailsSidebarTabs } from "./tabs";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CaseDetailsContent } from "./case-details-content";
import { IssuesContent } from "./issues-content";
import { PdfViewer } from "./pdf-viewer";

const tabs = ["Case Details", "Issues", "PDF"];

export const CaseDetailsSidebar = () => {
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
          <TabsContent
            value="Issues"
            className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <IssuesContent />
          </TabsContent>
          <TabsContent value="PDF">
            <PdfViewer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
