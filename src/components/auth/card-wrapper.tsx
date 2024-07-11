"use client";

import { Url } from "next/dist/shared/lib/router/router";
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Socials } from "./socials";
import { BackLink } from "./back-link";

interface CardWrapperProps {
  children: ReactNode;
  headerTitle: string;
  headerDescription: string;
  backButtonLabel: string;
  backButtonDescription: string;
  backButtonHref: Url;
  showSocial: boolean;
}

export function CardWrapper({
  children,
  headerTitle,
  headerDescription,
  backButtonLabel,
  backButtonHref,
  backButtonDescription,
  showSocial,
}: CardWrapperProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{headerTitle}</CardTitle>
          <CardDescription>{headerDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
          <Socials />
          <BackLink 
            backButtonLabel={backButtonLabel}
            backButtonHref={backButtonHref}
            backButtonDescription={backButtonDescription}
          />
        </CardContent>
      </Card>
    </div>
  );
}
