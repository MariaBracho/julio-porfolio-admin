import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import type { Project } from "../types/project";
import {
  type TProjectForm,
  projectSchema,
  projesctEditSchema,
} from "./projectSchema";

export default function useProjectForm(project?: Project | null) {
  const schema = project ? projesctEditSchema : projectSchema;

  return useForm<TProjectForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: project?.title ?? "",
      img: "",
      logo: "",
      url_link: project?.url_link ?? "",
      category_id: project?.category_id?.toString() ?? "",
    },
  });
}
