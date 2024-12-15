import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const NavBar = () => {
  return (
    <div className="flex gap-4">
      <Link href="/data-sources">Data Sources</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/cases">Cases</Link>
      <Link href="/new-case">
        <Button className="flex gap-2">
          <Plus className="h-4 w-4" /> New Case
        </Button>
      </Link>
    </div>
  );
};
