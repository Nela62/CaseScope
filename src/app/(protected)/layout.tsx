import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/providers/user-provider";
import { NavBar } from "@/components/navigation/nav-bar";

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

      return (
        <UserProvider userId={data.user.id}>
          <div className="flex lg:flex-row flex-col w-full h-full bg-background">
            <NavBar />
            <main className="py-10 lg:pl-72">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </UserProvider>
      );
    } else {
      redirect("/login");
    }
  }

  return <UserProvider userId={data.user.id}>{children}</UserProvider>;
}
