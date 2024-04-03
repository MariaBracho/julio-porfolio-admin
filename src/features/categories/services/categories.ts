import type { TypedSupabaseClient } from "@/types/supabaseClient";
import { CATEGORY_TABLE } from "../constants/categoryTable";

export const getCategories = (client: TypedSupabaseClient) => {
  return client
    .from(CATEGORY_TABLE)
    .select("name,id,created_at,icon", { count: "exact" });
};

export const createCategory = (client: TypedSupabaseClient) => {
  return client.from(CATEGORY_TABLE);
};
