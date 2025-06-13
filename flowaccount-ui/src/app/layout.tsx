import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MenuLayout from "../components/navigation/MenuLayout";
import CourtesyNav from "@/components/courtesy-nav/CourtesyNav";
import { UserProfileTester } from "@/components/userprofile";
import { PasswordProtection } from "@/components/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlowAccount Cloud Accounting App",
  description: "A modern cloud accounting app UI",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <PasswordProtection>
          <MenuLayout>{children}</MenuLayout>
          <CourtesyNav />
          <UserProfileTester />
        </PasswordProtection>
      </body>
    </html>
  );
}
