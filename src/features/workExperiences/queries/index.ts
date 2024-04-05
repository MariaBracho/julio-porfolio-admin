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

const { WORK_EXPERIENCES } = TABLE_KEYS;

const PROJECTS_COLUMNS = 'id,end_date,company,start_date,rol,description'

export const useGetWorkExperiences = () => {
  const client = useSupabaseBrowser();

  const query = client.from(WORK_EXPERIENCES);

  return useQuery(query.select(PROJECTS_COLUMNS, { count: "exact" }));
};

//TODO: fix type any

export const useCreateWorkExperience = () => {
  const client = useSupabaseBrowser();

  const query = client.from(WORK_EXPERIENCES);

  return useInsertMutation(query as any, ["id"],PROJECTS_COLUMNS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateWorkExperience = () => {
  const client = useSupabaseBrowser();

  const query = client.from(WORK_EXPERIENCES);

  return useUpdateMutation(query as any, ["id"], PROJECTS_COLUMNS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
  });
};

export const useDeleteWorkExperience = () => {
  const client = useSupabaseBrowser();

  const query = client.from(WORK_EXPERIENCES);

  return useDeleteMutation(query as any, ["id"], PROJECTS_COLUMNS, {
    onSuccess: async () => {
        toast.success(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
