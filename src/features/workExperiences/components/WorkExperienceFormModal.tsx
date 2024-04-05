import { type Dispatch, type SetStateAction } from "react";

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

import { WorkExperience } from "../types/workExperience";
import useWorkExperienceForm from "../form/useWorkExperienceForm";
import { useCreateWorkExperience, useUpdateWorkExperience } from "../queries";
import { WorkExperienceForm } from "../form/workExperienceSchema";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  isEdit: boolean;
  data: WorkExperience | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function WorkExperienceFormModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const title = isEdit ? "Editar Experiencia" : "Crear experiencia";

  const form = useWorkExperienceForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateWorkExperience();
  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateWorkExperience();

  const onSubmit: SubmitHandler<WorkExperienceForm> = async (values) => {
    if (isEdit && data) {
      await update(getThrutyValues({ ...values, id: data.id }), {
        onSuccess: async () => {
          toast.success(TOAST_MESSAGES.DATA_SAVED);
          setOpen(false);
        },
      });
      return;
    }

    await insert([values], {
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
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa</FormLabel>
            <FormControl>
              <Input className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="rol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rol</FormLabel>
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
        name="end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha final</FormLabel>
            <FormControl>
              <Input type="date" className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormModal>
  );
}
