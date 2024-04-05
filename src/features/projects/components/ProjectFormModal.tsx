"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

import { Input } from "@/components/ui/input";

import type { SubmitHandler } from "react-hook-form";

import {
  useCreateProject,
  useUpdateProject,
} from "@/features/projects/queries/projects";

import type { Project } from "@/features/projects/types/project";

import FormModal from "@/components/modals/FormModal";
import useProjectForm from "@/features/projects/form/useProjectForm";

import { useGetCategories } from "@/features/categories/queries/categoriesQueries";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ProjectForm } from "@/features/projects/form/projectSchema";

import { getThrutyValues } from "@/utils/getThrutyValues";

import { getFile } from "@/utils/getFile";

import useProjectStorage from "../hooks/useProjectStorage";
import { ACCEPT_FILE_TYPES } from "@/constants/acceptFileTypes";

interface Props {
  isEdit: boolean;
  data?: Project | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProjectFormModal({
  isEdit = false,
  data,
  open = false,
  setOpen,
}: Props) {
  const title = isEdit ? "Editar proyecto" : "Crear proyecto";

  const form = useProjectForm(data);

  const { handleSubmit } = form;

  const { mutateAsync: insert, isPending } = useCreateProject();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdateProject();

  const [img, setImg] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);

  const onUpdateImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImg(getFile(event));
  };

  const onUpdateLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLogo(getFile(event));
  };

  const { uploadFiles, updateFiles } = useProjectStorage();

  const onSubmit: SubmitHandler<ProjectForm> = async (values) => {
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
        })
      );

      return;
    }

    await insert(
      [
        {
          title: values.title,
          category_id: Number(values.category_id),
          url_link: values.url_link,
          img: null,
          logo: null,
        },
      ],
      {
        onSuccess: async (data) => {
          if (img && logo) {
            const { urlImg, urlIcon } = await uploadFiles({
              img,
              icon: logo,
            });
            data &&
              update({
                id: data[0].id,
                img: urlImg,
                logo: urlIcon,
              });
          }
        },
      }
    );
  };

  const { data: categories } = useGetCategories();

  return (
    <FormModal
      formProps={form}
      onSubmit={handleSubmit(onSubmit)}
      title={title}
      onOpenChange={setOpen}
      open={open}
      isLoading={isPending || isPendingUpdate}
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
    </FormModal>
  );
}
