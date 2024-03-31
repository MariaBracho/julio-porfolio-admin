"use client";

import supabase from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { push } = useRouter();

  const supabaseClient = supabase();

  const handledLogout = async () => {
    await supabaseClient.auth.signOut().then(() => {
      push("/login");
    });
  };

  return (
    <p onClick={handledLogout} className="cursor-pointer">
      Logout
    </p>
  );
}
