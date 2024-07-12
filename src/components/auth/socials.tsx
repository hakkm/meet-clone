"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_REDIRECT } from "@/routes";

export function Socials() {

  function onClick(provider: "google"| "github" | "discord") {
    signIn(provider, {callbackUrl: DEFAULT_REDIRECT})
  }
  return <div className="grid gap-2">
    <Button size="lg" className="w-full" variant="outline" onClick={()=>onClick("google")}>
      <FcGoogle className="mr-2 w-4 h-4" /> Continue with Google
    </Button>
    <Button size="lg" className="w-full" variant="outline" onClick={()=>onClick("github")}> 
      <FaGithub className="mr-2 w-4 h-4" /> Continue with Github
    </Button>
    <Button size="lg" className="w-full" variant="outline" onClick={()=>onClick("discord")}>
      <FaDiscord className="mr-2 w-4 h-4" /> Continue with Discord
    </Button>
  </div>;
}
