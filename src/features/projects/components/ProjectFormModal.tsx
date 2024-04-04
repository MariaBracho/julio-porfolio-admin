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
import useSupabaseBrowser from "@/utils/supabase-browser";
import { PROJECT_TABLE } from "../constants/projectTable";
import { getFile } from "@/utils/getFile";
import { formatFileName } from "@/utils/formatFileName";

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
  const client = useSupabaseBrowser();
  const query = client.storage.from(PROJECT_TABLE);

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

  interface updatedProjectFile {
    publicUrlImg?: string | null;
    publicUrlLogo?: string | null;
  }

  const updatedModal = async ({
    publicUrlImg,
    publicUrlLogo,
  }: updatedProjectFile) => {
    setOpen(false);

    const fileNameImg = data?.img.split("/").at(-1);
    const fileNameLogo = data?.logo.split("/").at(-1);

    publicUrlImg && (await query.remove([`${fileNameImg}`]));
    publicUrlLogo && (await query.remove([`${fileNameLogo}`]));
  };

  const onSubmit: SubmitHandler<ProjectForm> = async (values) => {
    let filePathImg = null;
    let filePathLogo = null;

    let publicUrlImg: string | null = null;
    let publicUrlLogo: string | null = null;

    if (img) {
      const fileNameImg = formatFileName(img.name);

      const { data: imgData } = await query.upload(fileNameImg, img, {
        cacheControl: "3600",
      });

      filePathImg = imgData;
    }

    if (logo) {
      const fileNameLogo = formatFileName(logo.name);

      const { data: logoData } = await query.upload(fileNameLogo, logo, {
        cacheControl: "3600",
      });

      filePathLogo = logoData;
    }

    if (filePathImg) {
      const {
        data: { publicUrl },
      } = query.getPublicUrl(filePathImg.path);

      publicUrlImg = publicUrl;
    }

    if (filePathLogo) {
      const {
        data: { publicUrl },
      } = query.getPublicUrl(filePathLogo.path);

      publicUrlLogo = publicUrl;
    }

    if (isEdit && data) {
      await update(
        getThrutyValues({
          ...values,
          category_id: Number(values.category_id),
          img: publicUrlImg,
          logo: publicUrlLogo,
          id: data.id,
        }),
        {
          onSuccess: () => updatedModal({ publicUrlImg, publicUrlLogo }),
        }
      );
    } else {
      await insert(
        [
          {
            ...values,
            category_id: Number(values.category_id),
            img: publicUrlImg,
            logo: publicUrlLogo,
          },
        ],
        {
          onSuccess: () => updatedModal({}),
        }
      );
    }
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
              <Input id="title" className="w-full" {...field} />
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
