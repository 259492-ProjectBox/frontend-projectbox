import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ProgramProvider } from "@/context/ProgramContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CMU ENG Project",
  description: "A Platform for Archiving Senior Projects at CMU Engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
				<link rel="icon" type="image/jpeg" href="/logo-engcmu/RibbinENG2.png" />
			</head> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        	<ProgramProvider>
				{children}
			</ProgramProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
