"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithButton } from "@/components/inputWithButton";

export default function SwotAnalysisPage() {
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
      <div className="p-8 max-w-3xl mx-auto w-160">
        <h1 className="w-full text-4xl font-semibold p-2 mb-4">
          SWOT Analysis
        </h1>
        <InputWithButton
          onGenerate={handleGenerate}
          placeholder="Give me a description about your company"
        />
        {ideas && (
          <p className="mt-4 bg-gray-100 p-4 whitespace-pre-wrap break-words">
            {ideas}
          </p>
        )}
      </div>
    </div>
  );
}
