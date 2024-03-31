import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@/utils/supabase-browser";

import { createCategory, getCategories } from "../services/categories";
import { TOAST_MESSAGES } from "@/constants/toastMessage";

export const useGetCategories = () => {
  const supabase = useSupabaseBrowser();

  return useQuery(getCategories(supabase));
};

export const useCreateCategory = () => {
  const client = useSupabaseBrowser();

  return useInsertMutation(createCategory(client), ["id"], "id,name", {
    onError: () => {
      toast.error("El nombre de la categoria debe ser unico");
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateCategory = () => {
  const client = useSupabaseBrowser();

  return useUpdateMutation(createCategory(client), ["id"], "id,name", {
    onError: () => {
      toast.error("El nombre de la categoria debe ser unico");
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useDeleteCategory = () => {
  const client = useSupabaseBrowser();

  const query = client.from("categories");

  return useDeleteMutation(query, ["id"], "id,name", {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
