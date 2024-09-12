import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import DashboardWrapper from "./dashboard-wrapper";
import localFont from "next/font/local";

const geist = localFont({
  src: [
    {
      path: "../../fonts/geist-sans/Geist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/geist-sans/Geist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/geist-sans/Geist-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/geist-sans/Geist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/geist-sans/Geist-Black.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../fonts/geist-sans/Geist-UltraBlack.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Embedded Systems",
  description: "Raspberry Pi IoT Sensor's Playground",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardWrapper>
            {children}
            <Toaster />
          </DashboardWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
