"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  NewPasswordInputs,
  NewPasswordSchema,
} from "@/app/_lib/definitions";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/app/_lib/actions";

export default function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const form = useForm<NewPasswordInputs>({
    resolver: zodResolver(NewPasswordSchema),
  });

  function onSubmit(values: NewPasswordInputs) {
    startTransition(() => {
      newPassword(values, token).then((res) => {
        setError(res?.error || "");
        setSuccess(res?.success || "");
      });
    });
  }

  return (
    <CardWrapper
      headerTitle="Reset Password"
      headerDescription="Enter your new password below"
      backButtonLabel="Remember your password?"
      backButtonHref="/auth/login"
      backButtonDescription="Login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mb-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
