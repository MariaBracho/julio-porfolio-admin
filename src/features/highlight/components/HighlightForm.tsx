"use client";

import ProjectForm from "@/features/projects/components/ProjectForm";
import { useGetProjectHighlighted } from "@/features/highlight/services/highlightService";

export default function HighlightForm() {
  const { data, isLoading } = useGetProjectHighlighted();

  return (
    <>
      {data && !isLoading ? (
        <div className="max-w-lg">
          <p className="text-lg font-bold">Proyecto Detacado</p>
          <ProjectForm isHighlighted isEdit={Boolean(data[0])} data={data[0]} />
        </div>
      ) : (
        <p>isLoading...</p>
      )}
    </>
  );
}
