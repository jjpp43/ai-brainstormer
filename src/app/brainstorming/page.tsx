"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithButton } from "@/components/inputWithButton";
import WordCloud from "@/components/wordCloud";
import TreeChartReactFlow from "@/components/reactflow/TreeChartReactFlow";
import data from "../../../public/flare.json";
import BrainstormPrompt from "@/components/BrainstormPrompt";

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

  return (
    <div>
      <div className="py-4 w-full h-screen">
        {/* BrainStorming Visual Canvas */}
        <div className="rounded-lg overflow-hidden w-[1280px] h-full">
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
