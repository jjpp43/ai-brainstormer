"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardBrainstorming from "@/components/cardBrainstorming";
import CardSwotAnalysis from "@/components/cardSwotAnalysis";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState(null);
  const [type, setType] = useState("brainstorming"); // Default to brainstorming

  return (
    <>
      <div className="relative w-full h-screen">
        <SidebarTrigger className="absolute left-0 top-0 z-10" />
        <div className="flex flex-col h-full items-center justify-center">
          <h1 className="p-2 mb-4 ">How can we help you?</h1>
          <div className="flex flex-row gap-4">
            <CardBrainstorming />
            <CardSwotAnalysis />
          </div>
        </div>
      </div>
    </>
  );
}
