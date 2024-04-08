import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

const URL_NOTION_MESSAGE= "La URL debe empezar con 'https://julioquinones.notion.site'";
const URL_NOTION_BASE = "https://julioquinones.notion.site";

export const projectSchema = z.object({
  title: z.string().min(1, REQUIRED_MESSAGE),
  url_link: z.string().startsWith(URL_NOTION_BASE,URL_NOTION_MESSAGE).min(1, REQUIRED_MESSAGE),
  category_id: z.string().min(1, REQUIRED_MESSAGE),
  logo: z.string(),
  img: z.string(),
});

export const projesctEditSchema = projectSchema.partial();

export type ProjectForm = z.infer<typeof projectSchema>;
