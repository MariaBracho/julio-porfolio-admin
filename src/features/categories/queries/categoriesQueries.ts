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
import useCategoryStorage from "../hooks/useCategoryStorage";

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
  });
};



export const useDeleteCategory = () => {
  const client = useSupabaseBrowser();

  const { deleteIcon } = useCategoryStorage();


  const query = client.from(CATEGORY_TABLE);

  return useDeleteMutation(query as any, ["id"], "id,name,icon", {
      onSuccess: async (data) => {
        if (data?.icon && typeof data.icon === "string") {
          await deleteIcon(data.icon);
          toast.success(TOAST_MESSAGES.DATA_DELETED);
        }
      },
      onError: (error) => {
        if (error.code === "23503") {
          toast.error(TOAST_MESSAGES.NOT_REFERENCE_DATA);
        }
      },
    
  });
};
