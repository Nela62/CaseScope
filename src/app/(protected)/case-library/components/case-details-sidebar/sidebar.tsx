import { useAppStore } from "@/providers/app-store-provider";
import { CaseDetailsSidebarTabs } from "./tabs";
import { Tabs } from "@/components/ui/tabs";

const tabs = ["Case Details", "Issues", "PDF"];

export const CaseDetailsSidebar = () => {
  const { selectedCaseId } = useAppStore((state) => state);

  return (
    <div className="py-6 space-y-8">
      <Tabs>
        <CaseDetailsSidebarTabs tabs={tabs} />
        <p>Case Details for {selectedCaseId}</p>
      </Tabs>
    </div>
  );
};
