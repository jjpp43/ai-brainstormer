"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithButton } from "@/components/inputWithButton";
import WordCloud from "@/components/wordCloud";
import TreeChartReactFlow from "@/components/TreeChartReactFlow";
import data from "../../../public/flare.json";

export default function BrainstormingPage() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState(null);
  const [type, setType] = useState("brainstorming"); // Default to brainstorming
  const sampleData = {
    name: "Root",
    children: [
      { name: "A", children: [{ name: "A1" }, { name: "A2" }] },
      { name: "B", children: [{ name: "B1" }, { name: "B2" }] },
      { name: "C" },
    ],
  };
  const words = [
    "Brainstorming",
    "Brainstorming",
    "Brainstorming",
    "Brainstorming",
    "Brainstorming",
    "Brainstorming",
    "Brainstorming",
    "Brainstorming",
    "Creativity",
    "Creativity",
    "Abstract",
    "Structure",
    "Innovation",
    "Ideas",
    "Ideas",
    "Ideas",
    "Ideas",
    "Ideas",
    "Ideas",
    "Mindmap",
    "Concepts",
    "Flow",
    "Flow",
    "Inspiration",
    "Visualization",
    "Visualization",
    "Visualization",
    "Connections",
    "Connections",
    "Connections",
    "Connections",
    "Thinking",
    "Thinking",
    "Thinking",
    "Thinking",
    "Thinking",
    "Thinking",
    "Patterns",
    "Strategy",
    "Logic",
    "Imagination",
    "Framework",
    "Discovery",
    "Collaboration",
    "Analysis",
    "Synthesis",
    "Design",
    "Iteration",
    "Problem-Solving",
    "Insights",
    "Insights",
    "Insights",
    "Insights",
    "Perspectives",
    "Mapping",
  ];
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
      <div className="p-8 max-w-8xl mx-auto ">
        {/* <WordCloud words={words} /> */}
        <div className="w-full flex flex-col items-center">
          <h1 className="text-4xl font-semibold p-2 mb-4">
            Brainstorm Visualizer
          </h1>
          <div className="w-160">
            <InputWithButton onGenerate={handleGenerate} />
            {ideas && (
              <p className="mt-4 bg-gray-100 p-4 whitespace-pre-wrap break-words">
                {ideas}
              </p>
            )}
          </div>
        </div>
        {/* BrainStorming Visual Canvas */}
        <div className="rounded-lg overflow-hidden w-[1280px] h-[640px] ">
          <TreeChartReactFlow data={data} />
        </div>
      </div>
    </div>
  );
}
