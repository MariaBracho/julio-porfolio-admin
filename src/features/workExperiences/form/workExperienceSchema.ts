import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const workExperienceSchema= z.object({
    company: z.string().min(1, REQUIRED_MESSAGE),
    rol: z.string().min(1, REQUIRED_MESSAGE),
    description: z.string().min(1, REQUIRED_MESSAGE),
    start_date: z.string().min(1, REQUIRED_MESSAGE),
    end_date: z.string().min(1, REQUIRED_MESSAGE),
})

export type WorkExperienceForm = z.infer<typeof workExperienceSchema>