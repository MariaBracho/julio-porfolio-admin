import { useState, type Dispatch, type SetStateAction } from "react";

import { useUpload } from "@supabase-cache-helpers/storage-react-query";

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
import useSupabaseBrowser from "@/utils/supabase-browser";
import { getThrutyValues } from "@/utils/getThrutyValues";

import type { CategoryForm } from "@/features/categories/form/categorySchema";
import { formatFileName } from "@/utils/formatFileName";

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

  const client = useSupabaseBrowser();

  const query = client.storage.from("category");

  const { mutateAsync: upload } = useUpload(query, {
    buildFileName: ({ fileName }) => formatFileName(fileName),
  });

  const title = isEdit ? "Editar categoria" : "Crear categoria";

  const form = useCategoryForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateCategory();
  const { mutateAsync: update, isPending: isPedingUpdate } =
    useUpdateCategory();

  const onSubmit: SubmitHandler<CategoryForm> = async ({ name }) => {
    let publlicUrlIcon: string | null = null;

    if (icon) {
      const [iconPath] = await upload({
        files: [icon],
      });

      if (iconPath.data?.path) {
        const {
          data: { publicUrl },
        } = query.getPublicUrl(iconPath.data.path);

        publlicUrlIcon = publicUrl;
      }
    }

    if (isEdit && data?.icon) {
      const fileName = data.icon.split("/").at(-1);

      await update(
        getThrutyValues({ name, id: data?.id, icon: publlicUrlIcon }),
        {
          onSuccess: async () => {
            setOpen(false);
            publlicUrlIcon && (await query.remove([`${fileName}`]));
          },
        }
      );
    } else {
      await insert([{ name, icon: publlicUrlIcon }], {
        onSuccess: () => setOpen(false),
      });
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
