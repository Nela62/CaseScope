import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/providers/user-provider";
import { NavBar } from "@/components/navigation/nav-bar";
import { Banner } from "@/components/banner";

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
        <UserProvider
          userId={data.user.id}
          isAnonymous={data.user.is_anonymous ?? true}
        >
          <div className="flex flex-col w-full h-full">
           
            <div className="flex-1 min-h-0">
              <div className="flex lg:flex-row flex-col w-full h-full bg-background">
                <NavBar />
                <main className="bg-gray-50 w-full">
                  <div className="px-4 sm:px-6 lg:px-8 h-full">{children}</div>
                </main>
              </div>
            </div>
          </div>
        </UserProvider>
      );
    } else {
      redirect("/login");
    }
  }

  return (
    <UserProvider
      userId={data.user.id}
      isAnonymous={data.user.is_anonymous ?? true}
    >
      <div className="flex lg:flex-row flex-col w-full h-full bg-background">
        <div className="flex-none h-full">
          <NavBar />
        </div>
        <main className="bg-gray-50 overflow-y-auto flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 h-full">{children}</div>
        </main>
      </div>
    </UserProvider>
  );
}
