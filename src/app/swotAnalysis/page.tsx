"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { InputWithButton } from "@/components/inputWithButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SwotPrompt from "@/components/SwotPrompt";

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
    <div className="relative w-full h-screen">
      <SidebarTrigger className="absolute left-0 top-0 z-10" />
      <div className="flex flex-col w-full h-screen p-4">
        <div className="flex flex-col h-full items-center">
          {/* SWOT Analysis Prompt */}
          <SwotPrompt
            onGenerate={function (input: string): void {
              throw new Error("Function not implemented.");
            }}
            ideas={null}
          />
          {/* <div className="w-120 flex flex-col items-center py-8">
            <h1 className="text-4xl font-semibold p-2 mb-4">SWOT Analysis</h1>
            <InputWithButton
              onGenerate={handleGenerate}
              placeholder="Give me a description about your company"
            />
          </div> */}
          {/* Grid Outline */}
          <div className="relative flex flex-col w-full items-center gap-2 py-4">
            <div className=" flex flex-row justify-center w-full h-full gap-2">
              {/* 1. Strength Container */}
              <div className="relative w-2/5 h-72 border-2 border-slate-800 rounded-xl inverted-corner">
                <h1 className="absolute px-2 -top-6 left-8 bg-white font-semibold text-3xl text-yellow-500 tracking-widest">
                  Strength
                </h1>
                {/* TextArea Display & Edit */}
                <div className="w-full h-full p-6">
                  <textarea
                    className="w-full h-full border-none focus:outline-none focus:ring-0 resize-none overflow-hidden"
                    maxLength={500} // Adjust the limit as needed
                    placeholder="Type here..."
                    defaultValue={`• Once you’ve figured out your strengths, it’s time to turn that critical self-awareness on your weaknesses.
                      • Things your company lacks
                      • Things your competitors do better than you
                      • Resource limitations
                      • Unclear unique selling proposition`}
                  ></textarea>
                </div>
              </div>
              {/* 2. Weakness Container */}
              <div className="relative w-2/5 h-72 border-2 border-slate-800 rounded-xl">
                <h1 className="absolute px-2 -top-6 right-8 bg-white font-semibold text-3xl text-orange-500 tracking-widest">
                  Weakness
                </h1>
                {/* TextArea Display & Edit */}
                <div className="w-full h-full p-6">
                  <textarea
                    className="w-full h-full border-none focus:outline-none focus:ring-0 resize-none"
                    maxLength={300} // Adjust the limit as needed
                    placeholder="Type here..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center w-full h-full gap-2">
              {/* 3. Opportunity Container */}
              <div className="relative w-2/5 h-72 border-2 border-slate-800 rounded-xl">
                <h1 className="absolute px-2 -bottom-6 left-8 bg-white font-semibold text-3xl text-green-600 tracking-widest">
                  Opportunity
                </h1>
                {/* TextArea Display & Edit */}
                <div className="w-full h-full p-6">
                  <textarea
                    className="w-full h-full border-none focus:outline-none focus:ring-0 resize-none"
                    maxLength={300} // Adjust the limit as needed
                    placeholder="Type here..."
                  ></textarea>
                </div>
              </div>
              {/* 4. Threat Container */}
              <div className="relative w-2/5 h-72 border-2 border-slate-800 rounded-xl">
                <h1 className="absolute px-2 -bottom-6 right-8 bg-white font-semibold text-3xl text-blue-600 tracking-widest">
                  Threat
                </h1>
                {/* TextArea Display & Edit */}
                <div className="w-full h-full p-6">
                  <textarea
                    className="w-full h-full border-none focus:outline-none focus:ring-0 resize-none"
                    maxLength={300} // Adjust the limit as needed
                    placeholder="Type here..."
                    defaultValue={"Default Value"}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        {ideas && (
          <p className="mt-4 bg-gray-100 p-4 whitespace-pre-wrap break-words">
            {ideas}
          </p>
        )}
      </div>
    </div>
  );
}
