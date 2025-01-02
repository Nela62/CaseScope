import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Banner } from "@/components/banner";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casescope",
  description: "AI Copilot for Housing Attorneys",
};

// TODO: High: Check if the user is logged in and if not, show the banner
// TODO: High: Edit the banner to redirect to the login page
// TODO: High: Users should not be able to upload files without logging in
// TODO: High: Have sample files with extracted issues to showcase the demo

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}
      >
        <Providers>
          <div className="flex-none">{/* <Banner /> */}</div>
          <div className="flex-1 min-h-0">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
