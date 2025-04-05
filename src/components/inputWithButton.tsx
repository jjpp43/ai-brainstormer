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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deductToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tokens/", {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to deduct token");
        setLoading(false);
        return false; // ❌ Stop if token deduction fails
      }
      return true; // ✅ Proceed if token deduction is successful
    } catch (err) {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    const tokenAvailable = await deductToken(); // 🔹 First, deduct a token
    if (!tokenAvailable) return; // Stop if token deduction fails

    onGenerate(input); // 🔹 Then, send input to Gemini
  };

  return (
    <div className="flex w-full items-end space-x-2 ">
      <Input
        className="w-full bg-white border-slate-400 border-1"
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
