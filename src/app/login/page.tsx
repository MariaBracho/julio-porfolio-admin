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
import { Label } from "@/components/ui/label";
import supabase from "@/utils/supabase-browser";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { handleSubmit, register } = useForm<FormValues>();

  const [isPending, setIsPending] = useState(false);

  const supabaseClient = supabase();

  const { push } = useRouter();

  useEffect(() => {
    supabaseClient.auth.getUser().then((user) => {
      if (user.data.user) {
        push("/admin/categories");
      }
    });
  }, [push, supabaseClient.auth]);

  const onSubmit: SubmitHandler<FormValues> = handleSubmit(async (data) => {
    setIsPending(true);
    try {
      await supabaseClient.auth
        .signInWithPassword({
          email: data.email,
          password: data.password,
        })
        .then(() => {
          console.log("logged in");
          push("/admin/categories");
        });
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  });

  return (
    <div className="w-full h-screen grid place-content-center">
      <Card className="w-[350px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Bienvenido a la plataforma de administración.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" {...register("email")} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" {...register("password")} />
              </div>
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
      </Card>
    </div>
  );
}
