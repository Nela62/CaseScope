import { BriefcaseBusiness } from "lucide-react";
import { AddDocumentsDialog } from "./add-documents-dialog";

export const NoCases = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center lg:-mt-20">
      <BriefcaseBusiness className="mx-auto size-12 text-gray-400 stroke-1" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No Cases</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by adding past hearing cases to your library.
      </p>
      <div className="mt-6">
        <AddDocumentsDialog />
      </div>
    </div>
  );
};
