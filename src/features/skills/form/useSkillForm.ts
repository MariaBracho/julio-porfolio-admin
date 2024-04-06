import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import type { Skill } from "@/features/skills/types/skills";

import { type SkillsForm, skillsSchema } from "./skillSchema";

export default function useSkillForm(skill:Skill|null) {
  return useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    mode: "onChange",
    defaultValues: {
      name: skill?.name ?? "",
    },
  });
}
