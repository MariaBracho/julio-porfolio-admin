"use client";

import supabase from "@/utils/supabase-browser";
import { PinLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function Logout() {
  const { push } = useRouter();

  const supabaseClient = supabase();

  const handledLogout = async () => {
    console.log("Logout");
    await supabaseClient.auth.signOut().then(() => {
      push("/login");
      console.log("Logged out, susccessfully!");
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
