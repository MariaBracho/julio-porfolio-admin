import { TABLE_KEYS } from "@/constants/tableKeys";
import useSupabaseBrowser from "@/utils/supabase-browser";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

const PROJECT_COLUMNS =
  "id,img,logo,title,url_link,category_id,created_at,is_highlighted";

const { PROJECTS } = TABLE_KEYS;

export const useGetProjectHighlighted = () => {
  const supabase = useSupabaseBrowser();

  const query = supabase.from(PROJECTS);

  return useQuery(query.select(PROJECT_COLUMNS, { count: "exact" }).eq("is_highlighted",true));
};
