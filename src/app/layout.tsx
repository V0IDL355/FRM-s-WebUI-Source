import type { Metadata } from "next";
import "./css/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Ficsit Remote Monitoring",
  description: "Monitor your factory remotely!",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
