"use server";

import { signIn } from "@/auth";
import { Provider } from "./definitions";


export async function SocialLogin(provider: Provider){
  await signIn(provider, {
    redirectTo: "/profile",
  });
};
