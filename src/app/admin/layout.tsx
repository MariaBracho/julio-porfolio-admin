import Logout from "@/components/layout/Logout";
import Link from "next/link";
import supabase from "@/utils/supabase-server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseClient = supabase();

  const { data, error } = await supabaseClient.auth.getSession();

  if (error || !data.session?.access_token) {
    console.log(
      "User not found, redirecting to /login",
      data.session?.access_token
    );
    console.log("Error", error);
    redirect("/");
  }

  return (
    <div>
      <nav className="w-full text-white h-9 bg-slate-500 flex justify-center items-center relative">
        <div className="absolute right-5">
          <Logout />
        </div>
        <ul className="flex justify-center gap-3 items-center">
          <li>
            <Link href="/admin/categories">Categorias</Link>
          </li>
          <li>
            <Link href="/admin/projects">Proyectos</Link>
          </li>
        </ul>
      </nav>
      <main className="p-5">{children}</main>
    </div>
  );
}
