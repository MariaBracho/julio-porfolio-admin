import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import {
  useCreateCategory,
  useUpdateCategory,
} from "@/features/categories/queries/categoriesQueries";

import type { Category } from "@/features/categories/types/category";
import type { Dispatch, SetStateAction } from "react";

import useCategoryForm from "@/features/categories/form/useCategoryForm";

import FormModal from "@/components/modals/FormModal";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
  const title = isEdit ? "Editar categoria" : "Crear categoria";

  const form = useCategoryForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateCategory();
  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateCategory();

  const onSubmit: SubmitHandler<{ name: string }> = async ({ name }) => {
    isEdit && data
      ? await update(
          { name, id: data?.id },
          {
            onSuccess: () => {
              setOpen(false);
            },
          }
        )
      : await insert([{ name }], {
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
    </FormModal>
  );
}
