import { Github } from "lucide-react";
import Link from "next/link";

export const Banner = () => {
  return (
    <div className="flex items-center justify-center gap-2 bg-orange-300 py-1">
      <p className="text-sm">
        For demo purposes only. Get the code{" "}
        <Link href="https://dub.sh/7CadEJ3" className="underline font-semibold">
          here
        </Link>
      </p>
      <Github className="h-4 w-4 stroke-2" />
    </div>
  );
};
