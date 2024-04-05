import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const workExperienceSchema= z.object({
    company: z.string().min(1, REQUIRED_MESSAGE),
    rol: z.string().min(1, REQUIRED_MESSAGE),
    description: z.string().min(1, REQUIRED_MESSAGE),
    start_date: z.string().min(1, REQUIRED_MESSAGE),
    end_date: z.string().optional(),
    isJobFinish: z.optional(z.boolean())
}).refine(data => {
   if(data.isJobFinish && data.end_date === "") {
       return false;
   }
   return true
}, {
    message: REQUIRED_MESSAGE,
    path: ["end_date"]
});

export type WorkExperienceForm = z.infer<typeof workExperienceSchema>