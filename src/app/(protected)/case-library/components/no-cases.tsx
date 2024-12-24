import { BriefcaseBusiness, PlusIcon } from "lucide-react";

export const NoCases = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center lg:-mt-20">
      <BriefcaseBusiness className="mx-auto size-12 text-gray-400 stroke-1" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No Cases</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by adding past hearing cases to your library.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
          <PlusIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
          Add Documents
        </button>
      </div>
    </div>
  );
};
