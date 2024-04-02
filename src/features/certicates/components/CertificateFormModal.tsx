"use client";

import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import type { Certificate } from "@/features/certicates/types/certificate";

import { useState, type Dispatch, type SetStateAction } from "react";

import FormModal from "@/components/modals/FormModal";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import useCertificateForm from "@/features/certicates/form/useCertificateForm";

import {
  useCreateCertificate,
  useUpdateCertificate,
} from "@/features/certicates/queries/certificatesQueries";

import { CertificateForm } from "@/features/certicates/form/certificateSchema";
import useSupabaseBrowser from "@/utils/supabase-browser";

import { CERTIFICATE_TABLE } from "@/features/certicates/constants/certificateTable";
import { formatFileName } from "@/utils/formatFileName";
import { getFile } from "@/utils/getFile";

interface Props {
  isEdit: boolean;
  data?: Certificate | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CertificateFormModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  const title = isEdit ? "Editar certificado" : "Crear certificado";

  const form = useCertificateForm();

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateCertificate();

  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateCertificate();

  const onUpdateImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(getFile(event));
  };

  const client = useSupabaseBrowser();

  //TODO: add @supabase-cache-helpers/storage-react-query

  const onSubmit: SubmitHandler<CertificateForm> = async () => {
    const query = client.storage.from(CERTIFICATE_TABLE);

    if (!file) return;

    const fileName = formatFileName(file);

    const { data: imgData } = await query.upload(fileName, file, {
      cacheControl: "3600",
    });

    if (imgData) {
      const {
        data: { publicUrl },
      } = query.getPublicUrl(imgData?.path);

      if (isEdit && data) {
        const lastFile = data.img.split("/").at(-1);
        await query.remove([`${lastFile}`]);
        await update(
          {
            id: data.id,
            img: publicUrl,
          },
          {
            onSuccess: () => {
              setOpen(false);
            },
          }
        );
      } else {
        await insert([{ img: publicUrl }], {
          onSuccess: () => {
            setOpen(false);
          },
        });
      }
    }
  };

  return (
    <FormModal
      formProps={form}
      onSubmit={handleSubmit(onSubmit)}
      title={title}
      onOpenChange={setOpen}
      open={open}
      isLoading={isPending || isPedingUpdate}
    >
      <FormField
        control={form.control}
        name="img"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Certificado</FormLabel>
            <FormControl>
              <Input
                type="file"
                className="w-full"
                {...field}
                onChange={(value) => {
                  onUpdateImg(value);
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormModal>
  );
}
