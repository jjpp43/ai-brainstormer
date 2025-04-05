import type { Metadata } from "next";
import { Geist, Geist_Mono, Exo_2, Archivo } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ReactFlowProvider } from "reactflow";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindMap AI",
  description:
    "Generate and visualize creative brainstorming ideas with MindMap AI. Organize your thoughts in a clear, structured format for business, science, and creative planning, and conduct in-depth SWOT analysis to make informed decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={archivo.className}>
        <head>
          <link rel="icon" href="/icon.ico" sizes="any" />
        </head>
        <body className={`antialiased relative`}>
          <SidebarProvider>
            <AppSidebar />
            <main className=" flex w-full items-center justify-center">
              {children}
              {/* <DockWrapper /> */}
            </main>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
