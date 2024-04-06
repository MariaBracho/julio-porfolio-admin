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
import useRecommendationtorage from "../hooks/recommendationStorage";

const { RECOMMENDATIONS } = TABLE_KEYS;

const COLUMNS_RECOMMENDATIONS = "id,username,role,profilePicture,description";

export const useGetRecommendations = () => {
  const client = useSupabaseBrowser();

  const query = client.from(RECOMMENDATIONS).select(COLUMNS_RECOMMENDATIONS, { count: "exact" });

  return useQuery(query);
};

//TODO: fix type any

export const useCreateRecommendation = () => {
  const client = useSupabaseBrowser();

  const query = client.from(RECOMMENDATIONS);

  return useInsertMutation(query as any, ["id"], COLUMNS_RECOMMENDATIONS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateRecommendation = () => {
  const client = useSupabaseBrowser();

  const query = client.from(RECOMMENDATIONS);

  return useUpdateMutation(query as any, ["id"], COLUMNS_RECOMMENDATIONS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
  });
};

export const useDeleteRecommendation = () => {
  const client = useSupabaseBrowser();

  const query = client.from(RECOMMENDATIONS);

  const { deleteProfilePicture } = useRecommendationtorage();

  return useDeleteMutation(query as any, ["id"], COLUMNS_RECOMMENDATIONS, {
    onSuccess: async (data) => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
     if(data && data.profilePicture && typeof data.profilePicture === 'string'){
        await deleteProfilePicture(data.profilePicture);
     }

    },
    onError: () => {
      toast.error(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
