import { useAppStore } from "@/providers/app-store-provider";

export const CaseDetails = () => {
  const { selectedCaseId } = useAppStore((state) => state);
  return <div className="py-6">Case Details for {selectedCaseId}</div>;
};
