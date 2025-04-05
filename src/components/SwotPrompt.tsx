"use client";

import React from "react";
import { InputWithButton } from "@/components/inputWithButton";
import { Card } from "./ui/card";

interface SwotPromptProps {
  onGenerate: (input: string) => void;
  ideas: string | null;
}

const SwotPrompt: React.FC<SwotPromptProps> = ({ onGenerate, ideas }) => {
  return (
    <div>
      <h1 className="text-4xl font-semibold p-2 mb-2">SWOT Analysis</h1>
      <Card className="p-2 gap-3 bg-gray-100">
        {/* <h1 className="text-xl font-semibold">Swot Prompt</h1> */}

        <div className="w-96">
          <InputWithButton
            onGenerate={onGenerate}
            placeholder="Give me a description of the company"
          />
          <div className="text-xs pt-1 px-1 text-gray-500">
            Copy & Paste your company's information!
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwotPrompt;
