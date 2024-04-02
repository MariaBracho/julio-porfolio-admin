import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { type CertificateForm, certificateSchema } from "./certificateSchema";

export default function useCertificateForm() {
  return useForm<CertificateForm>({
    resolver: zodResolver(certificateSchema),
    mode: "onChange",
    defaultValues: {
      img: "",
    },
  });
}
