import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import { useCreateCategory } from "../../queries/categoriesQueries";

import type { Category } from "../../types/category";
import type { Dispatch, SetStateAction } from "react";

import useCategoryForm from "../../form/useCreateCategoryForm";

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

  const onSubmit: SubmitHandler<{ name: string }> = async ({ name }) => {
    await insert([{ name }], {
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
      isLoading={isPending}
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
