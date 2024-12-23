import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    if (!!process.env.IS_DEMO) {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }
    } else {
      redirect("/login");
    }
  }
}
