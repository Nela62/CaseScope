"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Banner = () => {
  const [hidden, setHidden] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-1.5 sm:px-3.5 sm:before:flex-1",
        hidden && "hidden"
      )}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#fba776] to-[#9089fc] opacity-50 blur-2xl pointer-events-none"></div>
      <p className="text-sm/6 text-gray-900 flex items-center gap-1">
        For demo purposes only.
        <Link
          href="https://dub.sh/7CadEJ3"
          className="font-semibold whitespace-nowrap flex gap-1.5 items-center"
        >
          View the code
          <Image
            src="/github-mark.png"
            alt="Github"
            className="size-4"
            width={16}
            height={16}
            sizes="100vw"
          />
        </Link>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px] cursor-pointer"
          onClick={() => setHidden(true)}
        >
          <span className="sr-only">Dismiss</span>
          <X aria-hidden="true" className="size-4 text-gray-900" />
        </button>
      </div>
    </div>
  );
};
