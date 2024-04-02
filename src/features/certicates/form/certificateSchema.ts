import { z } from "zod";

const REQUIRED_MESSAGE = "Este campo es requerido";

export const certificateSchema = z.object({
  img: z.string().min(1, REQUIRED_MESSAGE),
});

export type CertificateForm = z.infer<typeof certificateSchema>;
