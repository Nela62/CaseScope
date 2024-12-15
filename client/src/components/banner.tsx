import { Github } from "lucide-react";
import Link from "next/link";

export const Banner = () => {
  return (
    <div className="flex items-center justify-center gap-2 bg-orange-300 p-4">
      <h1 className="text-2xl font-bold">
        For demo purposes only. Get the code{" "}
        <Link href="https://dub.sh/7CadEJ3">here</Link>
      </h1>
      <Github className="h-4 w-4" />
    </div>
  );
};
