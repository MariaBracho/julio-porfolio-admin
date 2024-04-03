import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const categorySchema = z.object({
  name: z.string().min(1, REQUIRED_MESSAGE),
  icon: z.string().min(1, REQUIRED_MESSAGE)
});

export const editCategorySchema= z.object({
  name: z.string().min(1, REQUIRED_MESSAGE),
  icon: z.string().optional()
});

export type CategoryForm = z.infer<typeof categorySchema>;
