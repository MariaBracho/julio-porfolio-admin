import { redirect } from "next/navigation";

import supabase from "@/utils/supabase-server";
import NavBar from "@/components/layout/NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseClient = supabase();

  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session?.access_token) {
    redirect("/");
  }

  return (
    <div>
      <NavBar />
      <main className="p-5">{children}</main>
    </div>
  );
}
