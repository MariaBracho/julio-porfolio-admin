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

const { SKILLS } = TABLE_KEYS;

const COLUMNS_SKILLS = "id,name";

export const useGetSkills = () => {
  const client = useSupabaseBrowser();

  const query = client.from(SKILLS).select(COLUMNS_SKILLS);

  return useQuery(query);
};

//TODO: fix type any

export const useCreateSKills = () => {
  const client = useSupabaseBrowser();

  const query = client.from(SKILLS);

  return useInsertMutation(query as any, ["id"], COLUMNS_SKILLS, {
    onError: () => {
      toast.error("El nombre de la categoria debe ser unico");
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateSKills = () => {
  const client = useSupabaseBrowser();

  const query = client.from(SKILLS);

  return useUpdateMutation(query as any, ["id"], COLUMNS_SKILLS, {
    onError: () => {
      toast.error("El nombre de la categoria debe ser unico");
    },
  });
};

export const useDeleteSKills = () => {
  const client = useSupabaseBrowser();

  const query = client.from(SKILLS);

  return useDeleteMutation(query as any, ["id"], COLUMNS_SKILLS, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
