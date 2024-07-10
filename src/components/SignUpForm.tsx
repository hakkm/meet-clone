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
import { useActionState } from "react";
import { signup } from "@/app/signup/actions";

export function SignUpForm() {
  const [state, SignUpAction] = useActionState(signup, null);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={SignUpAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Name" required />
            {state?.errors.name && (
              <div className="text-red-500 text-sm">{state.errors.name}</div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
            {state?.errors.email && (
              <div className="text-red-500 text-sm">{state.errors.email}</div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" />

            {state?.errors?.password && (
              <div className="text-sm text-red-500">
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create an account
          </Button>
          <Button variant="outline" className="w-full">
            <Icons.google className="mr-2 w-4 h-4" /> Sign up with Google
          </Button>
          <Button variant="outline" className="w-full">
            <DiscordLogoIcon className="mr-2" /> Login with Discord
          </Button>
          <Button variant="outline" className="w-full">
            <GitHubLogoIcon className="mr-2" /> Login with Github
          </Button>
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
