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

import { getFile } from "@/utils/getFile";

import useCertificatesStorage from "../hooks/useCertificatesStorage";

import { ACCEPT_FILE_TYPES } from "@/constants/acceptFileTypes";

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
  const [files, setFiles] = useState<FileList | null>(null);

  const title = isEdit ? "Editar certificado" : "Crear certificado";

  const form = useCertificateForm();

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateCertificate();

  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateCertificate();

  const onUpdateImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(event.target.files);
  };

  const { uploadCertificate, updatedCertificate } = useCertificatesStorage();

  const onSubmit: SubmitHandler<CertificateForm> = async () => {
    if (!files) return;

    if (isEdit && data) {
      const publicUrl = await updatedCertificate({
        lastFile: data.img,
        newFile: files[0],
      });

      await update(
        {
          id: data.id,
          img: publicUrl,
        },
        {
          onSuccess: async () => {
            setOpen(false);
          },
        }
      );

      return;
    }

    const publicUrls = await uploadCertificate(files);

    await insert(publicUrls, {
      onSuccess: () => {
        setOpen(false);
      },
    });
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
                multiple={isEdit ? false : true}
                accept={ACCEPT_FILE_TYPES}
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
