"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CardBrainstorming from "@/components/cardBrainstorming";
import CardSwotAnalysis from "@/components/cardSwotAnalysis";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [ideas, setIdeas] = useState(null);
  const [type, setType] = useState("brainstorming"); // Default to brainstorming

  return (
    <>
      <div className="p-8 max-w-3xl">
        <div className="flex flex-col items-center">
          <h1 className="w-full text-4xl font-semibold p-2 mb-4">
            What can we help you with?
          </h1>

          <div className="flex flex-row gap-4">
            <CardBrainstorming />
            <CardSwotAnalysis />
          </div>
        </div>
      </div>
    </>
  );
}
