import { CardWrapper } from "@/components/auth/card-wrapper";
import { ReactNode } from "react";

interface LoginFormProps {
  children: ReactNode;
}

export default function LoginForm({ children }: LoginFormProps) {
  return (
    <CardWrapper
      headerTitle="Login"
      headerDescription="Enter your email below to login to your account"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      backButtonDescription="Register"
    >
    {children}
    </CardWrapper>
  );
}
