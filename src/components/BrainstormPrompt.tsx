"use client";

import React from "react";
import { InputWithButton } from "@/components/inputWithButton";

interface BrainstormPromptProps {
  onGenerate: (input: string) => void;
  ideas: string | null;
}

const BrainstormPrompt: React.FC<BrainstormPromptProps> = ({
  onGenerate,
  ideas,
}) => {
  return (
    <div className="w-full flex flex-col items-start">
      <h1 className="text-xl font-semibold p-1">Brainstorm Prompt</h1>
      <div className="w-96">
        <InputWithButton onGenerate={onGenerate} />
        {ideas && <p className="mt-4 bg-gray-100 p-4  break-words">{ideas}</p>}
      </div>
    </div>
  );
};

export default BrainstormPrompt;
