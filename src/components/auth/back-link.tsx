import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import React from "react";

interface BackLinkProps {
  backButtonLabel: string;
  backButtonHref: Url;
  backButtonDescription: string;
}

export function BackLink({
  backButtonLabel,
  backButtonHref,
  backButtonDescription,
}: BackLinkProps) {
  return (
    <div className="mt-4 text-center text-sm">
      {backButtonLabel}{" "}
      <Link href={backButtonHref} className="underline">
        {backButtonDescription}
      </Link>
    </div>
  );
}
