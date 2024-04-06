import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import useSupabaseBrowser from "@/utils/supabase-browser";

import { TOAST_MESSAGES } from "@/constants/toastMessage";

import { TABLE_KEYS } from "@/constants/tableKeys";
import useEducationStorage from "../hooks/useEducationStorage";

const { EDUCATION } = TABLE_KEYS;

const COLUMNS_EDUCATION = "id,training,institution,start_date,end_date,isEducationFinish,logo";

export const useGetEducations = () => {
  const client = useSupabaseBrowser();

  const query = client.from(EDUCATION).select(COLUMNS_EDUCATION, { count: "exact" });

  return useQuery(query);
};

//TODO: fix type any

export const useCreateEducation = () => {
  const client = useSupabaseBrowser();

  const query = client.from(EDUCATION);

  return useInsertMutation(query as any, ["id"], COLUMNS_EDUCATION, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateEducation = () => {
  const client = useSupabaseBrowser();

  const query = client.from(EDUCATION);

  return useUpdateMutation(query as any, ["id"], COLUMNS_EDUCATION, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
  });
};

export const useDeleteEducation = () => {
  const client = useSupabaseBrowser();

  const query = client.from(EDUCATION);

  const {deleteIcon}=useEducationStorage();

  return useDeleteMutation(query as any, ["id"], COLUMNS_EDUCATION, {
    onSuccess: async (data) => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
      if(data && data.logo && typeof data.logo === 'string'){
        await deleteIcon(data.logo);
     }
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
