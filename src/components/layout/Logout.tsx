"use client";

import supabase from "@/utils/supabase-browser";
import { useRouter } from "next/navigation";
import { PinLeftIcon } from "@radix-ui/react-icons";

export default function Logout() {
  const { push } = useRouter();

  const supabaseClient = supabase();

  const handledLogout = async () => {
    await supabaseClient.auth.signOut().then(() => {
      push("/login");
    });
  };

  return (
    <div
      className="w-full flex cursor-pointer items-center gap-2"
      onClick={handledLogout}
    >
      <PinLeftIcon className="h-4 w-4" />
      <p>Logout</p>
    </div>
  );
}
