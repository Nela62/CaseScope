"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Banner = () => {
  return (
    <div
      className={cn(
        "relative isolate flex justify-center items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-1.5 sm:px-3.5 sm:before:flex-1"
      )}
    >
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-[#fba776] to-[#9089fc] opacity-50 blur-2xl pointer-events-none"></div>
      <p className="text-sm/6 text-gray-900 flex items-center gap-1">
        For demo purposes only.
        {/* <Link
          href="/login"
          className="font-semibold whitespace-nowrap flex gap-1.5 items-center"
        >
          Login
          <ArrowRightIcon className="size-4" />
        </Link> */}
      </p>
    </div>
  );
};
