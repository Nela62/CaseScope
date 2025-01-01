import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

// TODO: Low: Standardize the color of borders
export const ExploreCasesTabs = ({ tabs }: { tabs: string[] }) => {
  return (
    <div className="">
      <div>
        <div className="grid grid-cols-1 sm:hidden ">
          <select
            defaultValue={tabs[0]}
            aria-label="Select a tab"
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          >
            {tabs.map((tab) => (
              <option key={tab}>{tab}</option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
          />
        </div>
        <div className="hidden sm:block">
          <TabsList defaultValue={tabs[0]}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="bg-white w-fit">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>
    </div>
  );
};
