import { TABLE_KEYS } from "@/constants/tableKeys";
import type { TypedSupabaseClient } from "@/types/supabaseClient";

const { CATEGORIES } = TABLE_KEYS;

export const getCategories = (client: TypedSupabaseClient) => {
  return client
    .from(CATEGORIES)
    .select("name,id,created_at,icon", { count: "exact" });
};

export const createCategory = (client: TypedSupabaseClient) => {
  return client.from(CATEGORIES);
};
