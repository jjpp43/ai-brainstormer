"use client";

import React, { useState } from "react";
import { InputWithButton } from "@/components/inputWithButton";
import { Card } from "./ui/card";

interface BrainstormPromptProps {
  onGenerate: (input: string) => void;
  ideas: string | null;
}

const BrainstormPrompt: React.FC<BrainstormPromptProps> = ({
  onGenerate,
  ideas,
}) => {
  return (
    <Card className="p-4 gap-3 bg-slate-100">
      {/* <h1 className="text-xl font-semibold">Brainstorm Prompt</h1> */}
      <div className="w-96">
        <InputWithButton onGenerate={onGenerate} />
        {ideas && <p className="mt-4 bg-gray-100 p-4 break-words">{ideas}</p>}
      </div>
    </Card>
  );
};

export default BrainstormPrompt;
