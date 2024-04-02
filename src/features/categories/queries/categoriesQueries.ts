import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import useSupabaseBrowser from "@/utils/supabase-browser";

import {
  createCategory,
  getCategories,
} from "@/features/categories/services/categories";

import { TOAST_MESSAGES } from "@/constants/toastMessage";

import { CATEGORY_TABLE } from "@/features/categories/constants/categoryTable";

export const useGetCategories = () => {
  const supabase = useSupabaseBrowser();

  return useQuery(getCategories(supabase));
};

//TODO: fix type any

export const useCreateCategory = () => {
  const client = useSupabaseBrowser();

  return useInsertMutation(createCategory(client) as any, ["id"], "id,name", {
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

  return useUpdateMutation(createCategory(client) as any, ["id"], "id,name", {
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

  const query = client.from(CATEGORY_TABLE);

  return useDeleteMutation(query as any, ["id"], "id,name", {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
