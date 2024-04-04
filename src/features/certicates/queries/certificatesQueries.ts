import { toast } from "sonner";

import {
  useDeleteMutation,
  useInsertMutation,
  useQuery,
  useUpdateMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import useSupabaseBrowser from "@/utils/supabase-browser";

import { TOAST_MESSAGES } from "@/constants/toastMessage";

import useCertificatesStorage from "@/features/certicates/hooks/useCertificatesStorage";

import { TABLE_KEYS } from "@/constants/tableKeys";

const CERTIFICATE_COLUMNS = "id,img,created_at";

const { CERTIFICATES } = TABLE_KEYS;

export const useGetCertificates = () => {
  const supabase = useSupabaseBrowser();

  const query = supabase.from(CERTIFICATES);

  return useQuery(query.select(CERTIFICATE_COLUMNS));
};

//TODO: fix type any

export const useCreateCertificate = () => {
  const client = useSupabaseBrowser();

  const query = client.from(CERTIFICATES);

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

  const query = client.from(CERTIFICATES);

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

  const { removeCertificate } = useCertificatesStorage();

  const query = client.from(CERTIFICATES);

  return useDeleteMutation(query as any, ["id"], CERTIFICATE_COLUMNS, {
    onSuccess: async (data) => {
      toast.success(TOAST_MESSAGES.DATA_DELETED);
      if (data?.img && typeof data.img === "string") {
        await removeCertificate(data.img);
      }
    },
  });
};
