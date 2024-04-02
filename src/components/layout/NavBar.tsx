"use client";

import { NAVBAR_ROUTER } from "@/constants/navbarRouter";
import Logout from "./Logout";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const router = usePathname();

  return (
    <nav className="w-full text-white h-9 bg-slate-500 flex justify-center items-center relative">
      <div className="absolute right-5">
        <Logout />
      </div>
      <ul className="flex justify-center gap-4 items-center font-semibold">
        {NAVBAR_ROUTER.map(({ label, path }) => {
          return (
            <li
              key={path}
              className={`hover:text-primary ${
                router === path && "text-primary"
              }`}
            >
              <Link href={path}>{label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
