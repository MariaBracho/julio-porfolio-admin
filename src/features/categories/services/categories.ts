import type { TypedSupabaseClient } from "@/types/supabaseClient";

const CATEGORY_TABLE = "categories";

export const getCategories = (client: TypedSupabaseClient) => {
  return client.from(CATEGORY_TABLE).select("name,id", { count: "exact" });
};

export const createCategory = (client: TypedSupabaseClient) => {
  return client.from(CATEGORY_TABLE);
};
