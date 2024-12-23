import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    if (!!process.env.IS_DEMO) {
      console.log("signing in anonymously");
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        throw error;
      }
    } else {
      redirect("/login");
    }
  }

  return <div>{children}</div>;
}
