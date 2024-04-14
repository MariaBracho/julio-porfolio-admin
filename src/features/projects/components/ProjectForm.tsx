import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ACCEPT_FILE_TYPES } from "@/constants/acceptFileTypes";
import useProjectForm from "../form/useProjectForm";
import { useGetCategories } from "@/features/categories/queries/categoriesQueries";
import { Form } from "@/components/ui/form";
import { useCreateProject, useUpdateProject } from "../queries/projects";
import { useEffect, useState } from "react";
import useProjectStorage from "../hooks/useProjectStorage";
import { getThrutyValues } from "@/utils/getThrutyValues";
import { getFile } from "@/utils/getFile";
import { SubmitHandler } from "react-hook-form";
import { Project } from "../types/project";
import { TProjectForm } from "../form/projectSchema";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function ProjectForm({
  isEdit,
  data,
  setOpen,
  setIsLoadingForm,
  isHighlighted = false,
}: {
  isEdit: boolean;
  data?: Project | null;
  setOpen?: (value: boolean) => void;
  setIsLoadingForm?: (value: boolean) => void;
  isHighlighted?: boolean;
}) {
  const form = useProjectForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateProject();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdateProject();

  const [img, setImg] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);

  useEffect(() => {
    setIsLoadingForm && setIsLoadingForm(isPending || isPendingUpdate);
  }, [isPending, isPendingUpdate, setIsLoadingForm]);

  const onUpdateImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImg(getFile(event));
  };

  const onUpdateLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogo(getFile(event));
  };

  const { uploadFiles, updateFiles } = useProjectStorage();

  const onSubmit: SubmitHandler<TProjectForm> = async (values) => {
    if (isEdit && data) {
      const { urlImg, urlIcon } = await updateFiles({
        imgFile: img,
        iconFile: logo,
      });

      await update(
        getThrutyValues({
          ...values,
          img: urlImg,
          logo: urlIcon,
          category_id: Number(values.category_id),
          id: data.id,
          is_highlighted: isHighlighted,
        }),
        {
          onSuccess: () => {
            setOpen && setOpen(false);
          },
        }
      );

      return;
    }

    if (img && logo) {
      const { urlImg, urlIcon } = await uploadFiles({
        img,
        icon: logo,
      });
      await insert(
        [
          {
            title: values.title,
            category_id: Number(values.category_id),
            url_link: values.url_link,
            img: urlImg,
            logo: urlIcon,
            is_highlighted: isHighlighted,
          },
        ],
        {
          onSuccess: () => setOpen && setOpen(false),
        }
      );
    }
  };

  const { data: categories } = useGetCategories();

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL del proyecto</FormLabel>
              <FormControl>
                <Input id="url_link" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo del proyecto</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPT_FILE_TYPES}
                  className="w-full"
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    onUpdateLogo(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto del proyecto</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="img"
                  className="w-full"
                  accept={ACCEPT_FILE_TYPES}
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    onUpdateImg(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige una categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map(({ id, name }) => {
                    return (
                      <SelectItem key={id} value={id.toString()}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        {
          <Button type="submit" disabled={isPending || isPendingUpdate}>
            {isPending ||
              (isPendingUpdate && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ))}
            Guardar
          </Button>
        }
      </form>
    </Form>
  );
}
