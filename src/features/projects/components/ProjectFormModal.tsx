"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import type { Project } from "@/features/projects/types/project";

import Modal from "@/components/modals/Modal";

import FormProject from "./ProjectForm";

interface Props {
  isEdit: boolean;
  data?: Project | null;
  open?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

export default function ProjectFormModal({
  isEdit = false,
  data,
  open = false,
  isLoading,
  setOpen,
}: Props) {
  const [isLodingForm, setIsLoadingForm] = useState(isLoading);
  const title = isEdit ? "Editar proyecto" : "Crear proyecto";

  useEffect(() => {
    setIsLoadingForm(isLoading);
  }, [isLoading]);

  return (
    <Modal
      title={title}
      onOpenChange={setOpen}
      open={open}
      isLoading={isLodingForm}
    >
      <FormProject
        setIsLoadingForm={setIsLoadingForm}
        isEdit={isEdit}
        data={data}
        setOpen={setOpen}
      />
    </Modal>
  );
}
