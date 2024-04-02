import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginForm, loginFormSchema } from "./logintFormSchema";

export default function useLoginForm() {
  return useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
}
