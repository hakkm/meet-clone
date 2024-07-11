import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/SignOutButton";
import { LoginButton } from "@/components/auth/login-button";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-11 mt-10">
      
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Video calls with anyone, anywhere
      </h1>
      <p className="text-gray-700 text-center mb-8">
        Stay connected and collaborate with friends, family, and colleagues no
        matter where you are.
      </p>
      <div className="flex space-x-4">
      <LoginButton>
        <Button size="lg">Sign In</Button>
      </LoginButton>
      </div>
    </main>
  );
}
