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
import { Education } from "../types/educationType";
import useEducationForm from "../form/useEducationForm";
import { EducationForm } from "../form/educationSchema";
import { Checkbox } from "@/components/ui/checkbox";
import useEducationStorage from "../hooks/useEducationStorage";
import {
  useCreateEducation,
  useUpdateEducation,
} from "../queries/educationQueries";

interface Props {
  isEdit: boolean;
  data: Education | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EducationFormModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const [icon, setIcon] = useState<File>();

  const title = isEdit ? "Editar educación" : "Crear educacion";

  const form = useEducationForm(data);

  const { handleSubmit, watch } = form;

  const isEducationFinish = watch("isEducationFinish");

  const { mutateAsync: insert, isPending } = useCreateEducation();
  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateEducation();

  const { updatedIcon, uploadIcon } = useEducationStorage();

  const onSubmit: SubmitHandler<EducationForm> = async (values) => {
    const endDate = isEducationFinish ? values.end_date : null;

    if (isEdit && data) {
      let urlIcon = null;

      if (icon) {
        const url = await updatedIcon({
          lastIcon: data.logo,
          newIcon: icon,
        });

        urlIcon = url;
      }
      await update(
        getThrutyValues({
          ...getThrutyValues({ ...values, logo: urlIcon }),
          id: data.id,
          end_date: endDate,
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

    const url = await uploadIcon(icon);
    await insert([{ ...values, logo: url, end_date: endDate }], {
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
        name="training"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formación</FormLabel>
            <FormControl>
              <Input className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institución</FormLabel>
            <FormControl>
              <Input className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de inicio</FormLabel>
            <FormControl>
              <Input type="date" className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="isEducationFinish"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex gap-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <div className="space-y-1 leading-none">
                  <FormLabel>La formacion ha teminado?</FormLabel>
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
      {isEducationFinish && (
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de finalización</FormLabel>
              <FormControl>
                <Input type="date" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo de la intitución</FormLabel>
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
