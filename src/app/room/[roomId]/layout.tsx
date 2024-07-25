import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react"


export const metadata: Metadata = {
  title: "Room",
  description: "Room page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
