import { z } from "zod";

export const projectSchema = z.object({
  logo: z.string(),
  img: z.string(),
  title: z.string(),
  url_link: z.string(),
  category_id: z.string(),
});

export const projesctEditSchema = projectSchema.partial();

export type ProjectForm = z.infer<typeof projectSchema>;
