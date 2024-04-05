import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import useSupabaseBrowser from "@/utils/supabase-browser";

import { TOAST_MESSAGES } from "@/constants/toastMessage";

import useProjectStorage from "../hooks/useProjectStorage";
import { TABLE_KEYS } from "@/constants/tableKeys";

const PROJECT_COLUMNS =
  "id,img,logo,title,url_link,category_id,created_at,categories(name,id)";

const { PROJECTS } = TABLE_KEYS;

export const useGetProjects = () => {
  const supabase = useSupabaseBrowser();

  const query = supabase.from(PROJECTS);

  return useQuery(query.select(PROJECT_COLUMNS, { count: "exact" }));
};

//TODO: fix type any

export const useCreateProject = () => {
  const client = useSupabaseBrowser();

  return useInsertMutation(
    client.from(PROJECTS) as any,
    ["id"],
    PROJECT_COLUMNS,
    {
      onError: () => {
        toast.error(TOAST_MESSAGES.ERROR);
      },
      onSuccess: () => {
        toast.success(TOAST_MESSAGES.DATA_SAVED);
      },
    }
  );
};

export const useUpdateProject = () => {
  const client = useSupabaseBrowser();

  const query = client.from(PROJECTS);

  return useUpdateMutation(query as any, ["id"], PROJECT_COLUMNS, {
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

  const query = client.from(PROJECTS);

  const { removeFiles } = useProjectStorage();

  return useDeleteMutation(query as any, ["id"], PROJECT_COLUMNS, {
    onSuccess: async (data) => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
      if (
        data?.img &&
        data?.logo &&
        typeof data.img === "string" &&
        typeof data.logo === "string"
      ) {
        await removeFiles([data.img, data.logo]);
      }
    },
  });
};
