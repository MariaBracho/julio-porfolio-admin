import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const projectSchema = z.object({
  title: z.string().min(1, REQUIRED_MESSAGE),
  url_link: z.string().min(1, REQUIRED_MESSAGE),
  category_id: z.string().min(1, REQUIRED_MESSAGE),
  logo: z.string(),
  img: z.string(),
});

export const projesctEditSchema = projectSchema.partial();

export type ProjectForm = z.infer<typeof projectSchema>;
