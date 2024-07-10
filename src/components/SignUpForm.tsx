"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Icons } from "./ui/icons";
import { useState } from "react";
import { useActionState } from "react";
import { LoadingButton } from "./ui/LoadingButton";
import { signIn } from "next-auth/react";

export function SignUpForm() {
  const [discordLoading, setDiscordLoading] = useState<"loading" | "neutral">(
    "neutral",
  );
  const [githubLoading, setGithubLoading] = useState<"loading" | "neutral">(
    "neutral",
  );
  const [googleLoading, setGoogleLoading] = useState<"loading" | "neutral">(
    "neutral",
  );
  const [loginLoading, setLoginLoading] = useState<"loading" | "neutral">(
    "neutral",
  );
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          {/* <div className="grid gap-2"> */}
            {/* <Label htmlFor="name">Name</Label> */}
            {/* <Input id="name" name="name" placeholder="Name" required /> */}
            {/* {state?.errors.name && ( */}
            {/*   <div className="text-red-500 text-sm">{state.errors.name}</div> */}
            {/* )} */}
          {/* </div> */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
            {/* {state?.errors.email && ( */}
            {/*   <div className="text-red-500 text-sm">{state.errors.email}</div> */}
            {/* )} */}
          </div>
          {/* <div className="grid gap-2"> */}
            {/* <Label htmlFor="password">Password</Label> */}
            {/* <Input id="password" type="password" name="password" /> */}

            {/* {state?.errors?.password && ( */}
            {/*   <div className="text-sm text-red-500"> */}
            {/*     <p>Password must:</p> */}
            {/*     <ul> */}
            {/*       {state.errors.password.map((error) => ( */}
            {/*         <li key={error}>- {error}</li> */}
            {/*       ))} */}
            {/*     </ul> */}
            {/*   </div> */}
            {/* )} */}
          {/* </div> */}
          <Button type="submit" className="w-full">
            Sign In with Email
          </Button>
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-xs text-muted-foreground">
              OR CONTINUE WITH
            </span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <LoadingButton
            loading={googleLoading === "loading"}
            onClick={() => {
              setGoogleLoading("loading");
              signIn("google", { redirect: true, callbackUrl: "/profile" });
            }}
            variant="outline"
            className="w-full"
          >
            <Icons.google className="mr-2 w-4 h-4" /> Google
          </LoadingButton>
          <LoadingButton
            loading={discordLoading === "loading"}
            onClick={() => {
              setDiscordLoading("loading");
              signIn("discord", { redirect: true, callbackUrl: "/profile" });
            }}
            variant="outline"
            className="w-full"
          >
            <DiscordLogoIcon className="mr-2" /> Discord
          </LoadingButton>
          <LoadingButton
            loading={githubLoading === "loading"}
            onClick={() => {
              setGithubLoading("loading");
              signIn("github", { redirect: true, callbackUrl: "/profile" });
            }}
            variant="outline"
            className="w-full"
          >
            <GitHubLogoIcon className="mr-2" /> GitHub
          </LoadingButton>{" "}
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
