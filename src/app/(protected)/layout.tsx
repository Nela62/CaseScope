import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/providers/user-provider";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    if (!!process.env.IS_DEMO) {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error || !data?.user) {
        throw error;
      }

      console.log(data.user);

      return <UserProvider userId={data.user.id}>{children}</UserProvider>;
    } else {
      redirect("/login");
    }
  }

  return <UserProvider userId={data.user.id}>{children}</UserProvider>;
}
