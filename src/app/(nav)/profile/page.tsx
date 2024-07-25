import { authOptions } from "@/app/_lib/nextAuth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  // const session: Session = (await getServerSession(authOptions)) as Session;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Secret Page</h1>
      {/* {session ? ( */}
      {/*   <div className="flex flex-col items-center"> */}
      {/*     <h1 className="text-3xl font-bold my-4">{session.user?.name}</h1> */}
      {/*     <Image */}
      {/*       src={session.user?.image as string} */}
      {/*       width={100} */}
      {/*       height={100} */}
      {/*       alt="session.user? image" */}
      {/*     /> */}
      {/*     <p className="text-lg text-gray-600">{session.user?.email}</p> */}
      {/*     <SignOutButton /> */}
      {/*   </div> */}
      {/* ) : ( */}
      {/*   <div> */}
      {/*     <p className="text-3xl font-bold my-4">Welcome to NextAuth.js</p> */}
      {/*     <Link href="/login"> */}
      {/*       <Button>Login</Button> */}
      {/*     </Link> */}
      {/*   </div> */}
      {/* )} */}
    </main>
  );
}
