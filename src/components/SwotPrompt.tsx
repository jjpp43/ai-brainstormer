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
      <h1 className="text-4xl font-semibold p-2 mb-4">SWOT Analysis</h1>
      <Card className="p-4 gap-3 bg-slate-100">
        {/* <h1 className="text-xl font-semibold">Swot Prompt</h1> */}

        <div className="w-96">
          <InputWithButton
            onGenerate={onGenerate}
            placeholder="Give me a description of the company"
          />
          {ideas && <p className="mt-4 bg-gray-100 p-4 break-words">{ideas}</p>}
        </div>
      </Card>
    </div>
  );
};

export default SwotPrompt;
