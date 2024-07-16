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
  ForgotPasswordInputs,
  ForgotPasswordSchema,
} from "@/app/_lib/definitions";
import { resetPassword } from "@/app/_lib/actions";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const form = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordInputs) {
    startTransition(() => {
      resetPassword(values).then((res) => {
        setError(res?.error || "");
        setSuccess(res?.success || "");
      });
    });
  }

  return (
    <CardWrapper
      headerTitle="Forgot Password"
      headerDescription="Enter your email below to reset your password"
      backButtonLabel="Remember your password?"
      backButtonHref="/auth/login"
      backButtonDescription="Login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mb-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="doe@example.com"
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
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
