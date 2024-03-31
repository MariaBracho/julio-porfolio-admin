import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const categorySchema = z.object({
  name: z.string().min(1, REQUIRED_MESSAGE),
});

export type CategoryForm = z.infer<typeof categorySchema>;
