//Import icons
"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { LayoutGrid, Home, Brain, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LogoSVG from "./Logo";
import { Button } from "./ui/button";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Brainstorming",
    url: "/brainstorming",
    icon: Brain,
  },
  {
    title: "SWOT Analysis",
    url: "/swotAnalysis",
    icon: LayoutGrid,
  },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname(); // Get current path
  const { user, isLoaded, isSignedIn } = useUser();
  return (
    <Sidebar>
      <SidebarContent className="bg-slate-100">
        <SidebarGroup>
          <div className="flex flex-col items-center pt-4">
            <LogoSVG size={64} />

            <div className="font-bold text-slate-800">MindMap AI</div>
          </div>
          <SidebarGroupLabel className=""></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title} className="py-1">
                    <SidebarMenuButton asChild className="">
                      <Link href={item.url} className="">
                        <item.icon
                          strokeWidth={isActive ? 3 : 2}
                          className={
                            isActive ? "text-slate-700" : "text-slate-500"
                          }
                        />
                        <span
                          className={
                            isActive
                              ? "font-bold text-slate-700"
                              : "font-medium text-slate-500"
                          }
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex flex-col px-4 py-16 bg-slate-100">
        <SignedOut>
          <SignInButton mode="modal">
            <Button className="border-t-1">Sign in or up</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row gap-4 items-center border-t-2 pt-4">
            <UserButton afterSignOutUrl="/" />
            {isLoaded && user && (
              <span className="font-medium text-slate-800">
                {user.firstName}
              </span>
            )}
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}
