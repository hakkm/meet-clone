/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/xYHqD5MkVkT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { signOut } from "next-auth/react"
import SignOutButton from "./SignOutButton";

export async function NavBar() {
  const session = await auth();
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link href="#" className="flex items-center" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          {/* <nav className="hidden md:flex gap-4"> */}
          {/*   <Link */}
          {/*     href="#" */}
          {/*     className="font-medium flex items-center text-sm transition-colors hover:underline" */}
          {/*     prefetch={false} */}
          {/*   > */}
          {/*     Home */}
          {/*   </Link> */}
          {/*   <Link */}
          {/*     href="#" */}
          {/*     className="font-medium flex items-center text-sm transition-colors hover:underline" */}
          {/*     prefetch={false} */}
          {/*   > */}
          {/*     About */}
          {/*   </Link> */}
          {/*   <Link */}
          {/*     href="#" */}
          {/*     className="font-medium flex items-center text-sm transition-colors hover:underline" */}
          {/*     prefetch={false} */}
          {/*   > */}
          {/*     Services */}
          {/*   </Link> */}
          {/*   <Link */}
          {/*     href="#" */}
          {/*     className="font-medium flex items-center text-sm transition-colors hover:underline" */}
          {/*     prefetch={false} */}
          {/*   > */}
          {/*     Contact */}
          {/*   </Link> */}
          {/* </nav> */}
          {!session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <Button variant="outline" size="sm">Sign in</Button>
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          ) : (
            <SignOutButton />
          )}
        </div>
      </div>
    </nav>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
