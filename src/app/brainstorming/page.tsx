"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithButton } from "@/components/inputWithButton";
import WordCloud from "@/components/wordCloud";
import TreeChartReactFlow from "@/components/reactflow/TreeChartReactFlow";
import data from "../../../public/flare.json";
import BrainstormPrompt from "@/components/BrainstormPrompt";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactFlowProvider, useReactFlow } from "reactflow";

export default function BrainstormingPage() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState(null);
  const [type, setType] = useState("brainstorming"); // Default to brainstorming

  const handleGenerate = async (input: string) => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: input || topic }),
    });

    const data = await res.json();
    setIdeas(data.ideas);
  };
  // const { fitView } = useReactFlow(); // Access fitView function

  // const handleSidebarClick = () => {
  //   fitView(); // Directly call fitView() when sidebar is clicked
  // };
  return (
    <div className="relative w-full h-screen">
      <SidebarTrigger className="absolute left-0 top-0 z-10" />
      <div className="flex flex-col w-full h-screen">
        {/* BrainStorming Visual Canvas */}
        <div className="overflow-hidden h-full">
          <TreeChartReactFlow
            data={data}
            onGenerate={handleGenerate}
            ideas={ideas}
          />
        </div>
      </div>
    </div>
  );
}
