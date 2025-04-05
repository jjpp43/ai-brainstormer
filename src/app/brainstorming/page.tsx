"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithButton } from "@/components/inputWithButton";
import TreeChartReactFlow from "@/components/reactflow/TreeChartReactFlow";
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

  function cleanAndParse(raw: string | null) {
    if (!raw) return null;

    // Remove backticks and ```json or ``` if present
    const cleaned = raw
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Failed to parse Gemini JSON:", err);
      return null;
    }
  }

  const parsedData = cleanAndParse(ideas);

  return (
    <div className="relative w-full h-screen">
      <SidebarTrigger className="absolute left-0 top-0 z-10" />
      <div className="flex flex-col w-full h-screen">
        {/* BrainStorming Visual Canvas */}
        <div className="overflow-hidden h-full">
          <ReactFlowProvider>
            <TreeChartReactFlow
              data={parsedData}
              onGenerate={handleGenerate}
              ideas={ideas}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
