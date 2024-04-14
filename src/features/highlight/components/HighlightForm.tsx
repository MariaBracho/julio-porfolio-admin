"use client";

import ProjectForm from "@/features/projects/components/ProjectForm";
import { useGetProjectHighlighted } from "@/features/highlight/services/highlightService";

export default function HighlightForm() {
  const { data, isLoading } = useGetProjectHighlighted();

  const isEdit = Boolean(data && data.length > 1);

  return (
    <>
      {data && !isLoading && (
        <div className="max-w-lg">
          <p className="text-lg font-bold">Proyecto Detacado</p>
          <ProjectForm isHighlighted isEdit={isEdit} data={data[0]} />
        </div>
      )}
    </>
  );
}
