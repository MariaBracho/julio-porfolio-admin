import { useState, type Dispatch, type SetStateAction } from "react";

import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/queries/categoriesQueries";

import type { Category } from "@/features/categories/types/category";

import useCategoryForm from "@/features/categories/form/useCategoryForm";

import FormModal from "@/components/modals/FormModal";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { getThrutyValues } from "@/utils/getThrutyValues";

import type { CategoryForm } from "@/features/categories/form/categorySchema";

import useCategoryStorage from "@/features/categories/hooks/useCategoryStorage";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/toastMessage";
import { ACCEPT_FILE_TYPES } from "@/constants/acceptFileTypes";

interface Props {
  isEdit: boolean;
  data?: Category | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CategoryModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const [icon, setIcon] = useState<File>();

  const title = isEdit ? "Editar categoria" : "Crear categoria";

  const form = useCategoryForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateCategory();
  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateCategory();

  const { updatedIcon, uploadIcon } = useCategoryStorage();

  const onSubmit: SubmitHandler<CategoryForm> = async ({ name }) => {
    if (isEdit && data) {
      await update(getThrutyValues({ name, id: data.id }), {
        onSuccess: async () => {
          if (icon) {
            const url = await updatedIcon({
              lastIcon: data.icon,
              newIcon: icon,
            });
            await update({ icon: url, id: data.id });
            toast.success(TOAST_MESSAGES.DATA_SAVED);
            setOpen(false);
            return;
          }
          setOpen(false);
          toast.success(TOAST_MESSAGES.DATA_SAVED);
        },
      });
      return;
    }

    const url = await uploadIcon(icon);
    await insert([{ name, icon: url }], {
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input id="name" className="w-full" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="icon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Icono</FormLabel>
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
