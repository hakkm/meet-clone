"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import RegisterCredentials from "./auth/RegisterCredentials";
import { Socials } from "./auth/socials";

export default function RegisterForm() {

  return (
    <CardWrapper
      headerTitle="Create Account"
      headerDescription="Enter your credentials below to create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      backButtonDescription="Log In"
    >
      <RegisterCredentials />
      <Socials />
    </CardWrapper>
  );
}
