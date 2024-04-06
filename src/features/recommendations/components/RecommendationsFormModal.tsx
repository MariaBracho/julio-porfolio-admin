import { useState, type Dispatch, type SetStateAction } from "react";

import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import FormModal from "@/components/modals/FormModal";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { getThrutyValues } from "@/utils/getThrutyValues";

import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toastMessage";
import { ACCEPT_FILE_TYPES } from "@/constants/acceptFileTypes";

import { Recommendations } from "../types/recommendations";
import useRecommendationsForm from "../form/useRecommendationsForm";
import {
  useCreateRecommendation,
  useUpdateRecommendation,
} from "../queries/recommendationsQueries";
import { RecommendationsForm } from "../form/recommendationsSchema";
import { Textarea } from "@/components/ui/textarea";
import useRecommendationtorage from "../hooks/recommendationStorage";

interface Props {
  isEdit: boolean;
  data: Recommendations | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function RecommendationsFormModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const [icon, setIcon] = useState<File>();

  const title = isEdit ? "Editar recomendación" : "Crear recomendación";

  const form = useRecommendationsForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateRecommendation();
  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateRecommendation();

  const { updatedProfilePicture, uploadProfilePicture } =
    useRecommendationtorage();

  const onSubmit: SubmitHandler<RecommendationsForm> = async (values) => {
    if (isEdit && data) {
      let urlIcon = null;
      if (icon) {
        const url = await updatedProfilePicture({
          lastIcon: data.profilePicture,
          newIcon: icon,
        });
        urlIcon = url;
      }
      await update(
        getThrutyValues({
          ...getThrutyValues({
            ...values,
            profilePicture: urlIcon,
            id: data.id,
          }),
        }),
        {
          onSuccess: () => {
            toast.success(TOAST_MESSAGES.DATA_SAVED);
            setOpen(false);
          },
        }
      );
      return;
    }
    const url = await uploadProfilePicture(icon);
    await insert([{ ...values, profilePicture: url }], {
      onSuccess: () => setOpen(false),
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
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del usuario</FormLabel>
            <FormControl>
              <Input className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rol del usuario</FormLabel>
            <FormControl>
              <Input className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profilePicture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Foto de perfil</FormLabel>
            <FormControl>
              <Input
                accept={ACCEPT_FILE_TYPES}
                type="file"
                className="w-full"
                {...field}
                onChange={(event) => {
                  setIcon(event.target.files?.[0]);
                  field.onChange(event);
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
