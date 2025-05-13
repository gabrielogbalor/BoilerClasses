import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BoilerClasses",
  description: "Course review platform for Purdue ECE courses",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
