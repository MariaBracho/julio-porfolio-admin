"use client";

import { NAVBAR_ROUTER } from "@/constants/navbarRouter";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "./Logout";

export default function SideBar() {
  const router = usePathname();
  return (
    <div className="flex flex-col w-72 h-screen px-4 py-6 bg-[#111827] text-[#9398a6]">
      <div className="flex flex-col gap-3 text-center mb-7">
        <div className="text-2xl font-bold text-white">
          <p>Admin</p>
        </div>
        <div className="text-white/75">
          <p className="font-bold">Julio Quiñones</p>
          <p className="font-light">UX/UI Design</p>
        </div>
      </div>
      <ul className="flex w-full flex-col gap-4 font-semibold flex-1">
        {NAVBAR_ROUTER.map(({ label, path }) => {
          return (
            <Link href={path} key={path}>
              <li
                className={`hover:text-white hover:bg-[#1f2937] ${
                  router === path && "text-white bg-[#1f2937]"
                } rounded-md p-2 cursor-pointer`}
              >
                {label}
              </li>
            </Link>
          );
        })}
      </ul>
      <Logout />
    </div>
  );
}
