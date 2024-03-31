"use client";

import { useLocalStorage } from "usehooks-ts";

export default function useIsActiveSession() {
  const [token] = useLocalStorage("sb-vplzcvescengkeqdszya-auth-token", null);

  return !!token;
}
