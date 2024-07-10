"use client";

import Link from "next/link";
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
import { signIn } from "next-auth/react";
import { Icons } from "./ui/icons";
import { LoadingButton } from "./ui/LoadingButton";
import { useState } from "react";

export function LoginForm() {
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
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <form>
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
              {/*   <div className="text-red-500 text-sm"> */}
              {/*     {state.errors.email} */}
              {/*   </div> */}
              {/* )} */}
            </div>
            <div className="grid gap-2">
              {/* <div className="flex items-center"> */}
              {/*   <Label htmlFor="password">Password</Label> */}
              {/*   <Link */}
              {/*     href="#" */}
              {/*     className="ml-auto inline-block text-sm underline" */}
              {/*   > */}
              {/*     Forgot your password? */}
              {/*   </Link> */}
              {/* </div> */}
              {/* <Input id="password" type="password" name="password" required /> */}
              {/* {state?.errors.password && ( */}
              {/*   <div className="text-red-500 text-sm"> */}
              {/*     {state.errors.password} */}
                {/* </div> */}
              {/* )} */}
            <LoadingButton
              type="submit"
              loading={loginLoading === "loading"}
              className="w-full mt-2"
            >
            Log In with Email
            </LoadingButton>{" "}
            </div>
          </form>
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
              signIn("google", {redirect: true, callbackUrl: "/profile"});
            }}
            variant="outline"
            className="w-full"
          >
            <Icons.google className="mr-2 w-4 h-4" /> Login with Google
          </LoadingButton>
          <LoadingButton
            loading={discordLoading === "loading"}
            onClick={() => {
              setDiscordLoading("loading");
              signIn("discord", {redirect: true, callbackUrl: "/profile"});
            }}
            variant="outline"
            className="w-full"
          >
            <DiscordLogoIcon className="mr-2" /> Login with Discord
          </LoadingButton>
          <LoadingButton
            loading={githubLoading === "loading"}
            onClick={() => {
              setGithubLoading("loading");
              signIn("github", {redirect: true, callbackUrl: "/profile"});
            }}
            variant="outline"
            className="w-full"
          >
            <GitHubLogoIcon className="mr-2" /> Login with GitHub
          </LoadingButton>{" "}
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
