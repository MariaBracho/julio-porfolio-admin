import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

const educationSchemaBase = z.object({
  training: z.string().min(1, REQUIRED_MESSAGE),
  institution: z.string().min(1, REQUIRED_MESSAGE),
  start_date: z.string().min(1, REQUIRED_MESSAGE),
  end_date: z.string().optional(),
  isEducationFinish: z.boolean(),
  logo: z.string().min(1, REQUIRED_MESSAGE),
});

export const educationSchema = educationSchemaBase.refine(
  (data) => {
    if (data.isEducationFinish && data.end_date === "") {
      return false;
    }
    return true;
  },
  {
    message: REQUIRED_MESSAGE,
    path: ["end_date"],
  }
);

export const educationEditSchema = educationSchemaBase
  .omit({ logo: true })
  .merge(
    z.object({
      logo: z.string().optional(),
    })
  ).refine(
    (data) => {
      if (data.isEducationFinish && data.end_date === "") {
        return false;
      }
      return true;
    },
    {
      message: REQUIRED_MESSAGE,
      path: ["end_date"],
    }
  );

export type EducationForm = z.infer<typeof educationSchema>;
