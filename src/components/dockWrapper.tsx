"use client";

import Dock from "../../reactbits/Dock/Dock";
import { Home, Brain, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DockWrapper() {
  const router = useRouter();
  const items = [
    {
      icon: <Home size={20} color="white" />,
      label: "Home",
      onClick: () => router.push("/"),
    },
    {
      icon: <Brain size={20} color="white" />,
      label: "Brainstorm",
      onClick: () => router.push("/brainstorming"),
    },
    {
      icon: <LayoutGrid size={20} color="white" />,
      label: "SWOT",
      onClick: () => router.push("/swotAnalysis"),
    },
  ];
  return (
    <Dock
      items={items}
      panelHeight={68}
      baseItemSize={50}
      magnification={70}
      className="border border-slate-700 bg-slate-100"
    />
  );
}
