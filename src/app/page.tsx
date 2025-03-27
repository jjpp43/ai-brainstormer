"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardBrainstorming from "@/components/cardBrainstorming";
import CardSwotAnalysis from "@/components/cardSwotAnalysis";
import SplitText from "../../reactbits/SplitText/SplitText";
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
          <h1 className="p-2 mb-4 ">
            <SplitText
              text="How can we help you?"
              className="text-4xl font-semibold text-center"
              delay={20}
              animationFrom={{
                opacity: 0,
                transform: "translate3d(0,-50px,0)",
              }}
              animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
              threshold={0.8}
              rootMargin="-50px"
            />
          </h1>
          <div className="flex flex-row gap-4">
            <CardBrainstorming />
            <CardSwotAnalysis />
          </div>
        </div>
      </div>
    </>
  );
}
