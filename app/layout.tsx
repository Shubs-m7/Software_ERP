import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "ERP Software V2",
  description: "Modern Enterprise Resource Planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
