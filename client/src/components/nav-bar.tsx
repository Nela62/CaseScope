"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <div className="flex gap-8 items-center py-2 px-4 border-b">
      <Link
        href="/data-sources"
        className={cn("text-sm", pathname === "/data-sources" && "font-bold")}
      >
        Data Sources
      </Link>
      <Link
        href="/explore"
        className={cn("text-sm", pathname === "/explore" && "font-bold")}
      >
        Explore
      </Link>
      <Link
        href="/cases"
        className={cn("text-sm", pathname === "/cases" && "font-bold")}
      >
        Cases
      </Link>
      <Link href="/new-case">
        <Button className="flex gap-2" variant="outline" size="sm">
          <Plus className="h-4 w-4" /> New Case
        </Button>
      </Link>
    </div>
  );
};
