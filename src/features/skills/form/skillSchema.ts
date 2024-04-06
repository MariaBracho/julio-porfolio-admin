import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const skillsSchema= z.object({
    name: z.string().min(1,REQUIRED_MESSAGE),
})

export type SkillsForm = z.infer<typeof skillsSchema>