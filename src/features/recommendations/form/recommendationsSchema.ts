import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const recommendationsSchema = z.object({
    username: z.string().min(1, REQUIRED_MESSAGE),
    role: z.string().min(1, REQUIRED_MESSAGE),
    profilePicture: z.string().min(1, REQUIRED_MESSAGE),
    description: z.string().min(1, REQUIRED_MESSAGE),
})

export const recommendationsEditSchema = recommendationsSchema.omit({
    profilePicture: true
}).merge(z.object({
    profilePicture: z.string(),
}))

export type RecommendationsForm = z.infer<typeof recommendationsSchema>