import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description: "A clean, modern weather application with current conditions, 5-day forecast, and weather maps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
