"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import supabase from "@/utils/supabase-browser";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import useLoginForm from "@/features/login/form/useLoginForm";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

export default function Login() {
  const formProps = useLoginForm();

  const { handleSubmit, control } = formProps;

  const [isPending, setIsPending] = useState(false);

  const supabaseClient = supabase();

  const { push } = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setIsPending(true);
    try {
      await supabaseClient.auth
        .signInWithPassword({
          email: data.email,
          password: data.password,
        })
        .then(() => {
          push("/admin/categories");
        });
    } catch (error) {
      toast.error("Correo o contraseña incorrectos");
    } finally {
      setIsPending(false);
    }
  });

  return (
    <div className="w-full h-screen grid place-content-center">
      <Card className="w-[350px]">
        <Form {...formProps}>
          <form onSubmit={onSubmit}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Bienvenido a la plataforma de administración.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input type="email" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Ingresar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
