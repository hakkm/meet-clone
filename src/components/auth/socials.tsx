"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord, FaGithub } from "react-icons/fa";

export function Socials() {
  return <div className="grid gap-2">
    <Button size="lg" className="w-full" variant="outline">
      <FcGoogle className="mr-2 w-4 h-4" /> Continue with Google
    </Button>
    <Button size="lg" className="w-full" variant="outline">
      <FaGithub className="mr-2 w-4 h-4" /> Continue with Github
    </Button>
    <Button size="lg" className="w-full" variant="outline">
      <FaDiscord className="mr-2 w-4 h-4" /> Continue with Discord
    </Button>
  </div>;
}
