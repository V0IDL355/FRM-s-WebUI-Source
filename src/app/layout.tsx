import type { Metadata } from "next";
import "./css/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Ficsit Remote Monitoring",
  description: "Monitor your factory remotely!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.png" rel="icon" type="image/png" />
        <meta name="referrer" content="no-referrer" />
      </head>
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
