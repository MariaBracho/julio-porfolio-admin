import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Education } from "@/features/education/types/educationType";
import {
  educationSchema,
  type EducationForm,
  educationEditSchema,
} from "./educationSchema";

export default function useEducationForm(educationData: Education | null) {
  const schema = educationData ? educationEditSchema : educationSchema;

  return useForm<EducationForm>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      training: educationData?.training ?? "",
      institution: educationData?.institution ?? "",
      start_date: educationData?.start_date ?? "",
      end_date: educationData?.end_date ?? "",
      isEducationFinish: educationData?.isEducationFinish ?? false,
      logo: "",
    },
  });
}
