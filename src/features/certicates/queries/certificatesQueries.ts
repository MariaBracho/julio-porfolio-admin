import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import useSupabaseBrowser from "@/utils/supabase-browser";

import { TOAST_MESSAGES } from "@/constants/toastMessage";
import { CERTIFICATE_TABLE } from "@/features/certicates/constants/certificateTable";

const CERTIFICATE_COLUMNS = "id,img,created_at";

export const useGetCertificates = () => {
  const supabase = useSupabaseBrowser();

  const query = supabase.from(CERTIFICATE_TABLE);

  return useQuery(query.select(CERTIFICATE_COLUMNS));
};

//TODO: fix type any

export const useCreateCertificate = () => {
  const client = useSupabaseBrowser();

  const query = client.from(CERTIFICATE_TABLE);

  return useInsertMutation(query as any, ["id"], CERTIFICATE_COLUMNS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useUpdateCertificate = () => {
  const client = useSupabaseBrowser();

  const query = client.from(CERTIFICATE_TABLE);

  return useUpdateMutation(query as any, ["id"], CERTIFICATE_COLUMNS, {
    onError: () => {
      toast.error(TOAST_MESSAGES.ERROR);
    },
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_SAVED);
    },
  });
};

export const useDeleteCertificate = () => {
  const client = useSupabaseBrowser();

  const query = client.from(CERTIFICATE_TABLE);

  return useDeleteMutation(query as any, ["id"], CERTIFICATE_COLUMNS, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
    },
  });
};
