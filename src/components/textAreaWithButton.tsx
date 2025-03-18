"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { CirclePlay } from "lucide-react";
import { useState } from "react";

type OnGenerateType = (input: string) => void;

interface InputWithButtonProps {
  onGenerate: OnGenerateType;
  placeholder?: string;
}

export function InputWithButton({
  onGenerate,
  placeholder = "Enter a topic you want to brainstorm",
}: InputWithButtonProps) {
  const [input, setInput] = useState("");

  const handleClick = () => {
    if (onGenerate) {
      onGenerate(input);
    }
  };
  return (
    <div className="flex w-full items-end space-x-2">
      <Input
        className="w-full focus:outline-none"
        placeholder={placeholder}
        value={input} // Bind input state
        onChange={(e) => setInput(e.target.value)}
      />

      <Button
        type="submit"
        onClick={handleClick}
        className="cursor-pointer "
        aria-label="Generate Button"
      >
        <div>Generate</div>
        <CirclePlay />
      </Button>
    </div>
  );
}
