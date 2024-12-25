import Link from "next/link";
import { PlusIcon } from "lucide-react";

export const AddDocumentsButton = () => {
  return (
    <Link
      href="/case-library/add-documents"
      className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
    >
      <PlusIcon aria-hidden="true" className="mr-1.5 -ml-0.5 size-5" />
      Add Documents
    </Link>
  );
};
