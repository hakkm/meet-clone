"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "./auth/card-wrapper";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/app/_lib/actions";
import FormError from "./form-error";
import FormSuccess from "./form-success";

export default function NewVerificationForm() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Invalid token");
      return;
    }
    verifyEmail(token)
      .then((res) => {
        setError(res?.error || "");
        setSuccess(res?.success || "");
      })
      .catch(() => {
        setError("An error occurred");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerTitle="Verify your email"
      headerDescription="We're confirming your email address"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/login"
      backButtonDescription="login"
    >
    {!success && !error && (
      <div className="flex items-center justify-center w-full">
        <Loader2 className="my-28 h-16 w-16 text-primary/60 animate-spin" />
      </div>
    )}
      <FormError message={error} />
      <FormSuccess message={success} />
    </CardWrapper>
  );
}
