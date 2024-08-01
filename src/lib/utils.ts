import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import bcrypt from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function saltAndHashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, 10);
  return hash.toString();
}

/* Stream Control Functions */

