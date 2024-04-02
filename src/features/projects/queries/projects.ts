import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import useSupabaseBrowser from "@/utils/supabase-browser";

import { TOAST_MESSAGES } from "@/constants/toastMessage";
import { PROJECT_TABLE } from "@/features/projects/constants/projectTable";

const PROJECT_COLUMNS =
  "id,img,logo,title,url_link,category_id,categories(name,id)";

export const useGetProjects = () => {
  const supabase = useSupabaseBrowser();

  const query = supabase.from(PROJECT_TABLE);

  return useQuery(query.select(PROJECT_COLUMNS));
};

export const useCreateProject = () => {
  const client = useSupabaseBrowser();

  const query = client.from(PROJECT_TABLE);

  return useInsertMutation(query, ["id"], PROJECT_COLUMNS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateProject = () => {
  const client = useSupabaseBrowser();

  const query = client.from(PROJECT_TABLE);

  return useUpdateMutation(query, ["id"], PROJECT_COLUMNS, {
    onError: () => {
      toast.error("El nombre de la categoria debe ser unico");
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useDeletePropject = () => {
  const client = useSupabaseBrowser();

  const query = client.from(PROJECT_TABLE);

  return useDeleteMutation(query, ["id"], PROJECT_COLUMNS, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
