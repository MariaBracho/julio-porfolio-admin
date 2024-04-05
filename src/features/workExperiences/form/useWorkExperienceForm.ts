import { useForm } from "react-hook-form";
import { WorkExperienceForm, workExperienceSchema } from "./workExperienceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tables } from "@/types/supabase";

export default function useWorkExperienceForm(
  workExperienceData: Tables<"workExperiences"> |null
) {
  return useForm<WorkExperienceForm>({
    resolver: zodResolver(workExperienceSchema),
    mode: "all",
    defaultValues: {
      company: workExperienceData?.company ?? "",
      rol: workExperienceData?.rol ?? "",
      description: workExperienceData?.description ?? "",
      start_date: workExperienceData?.start_date ?? "",
      end_date: workExperienceData?.end_date ?? "",
      isJobFinish: !!workExperienceData?.isJobFinish,
    },
  });
}
