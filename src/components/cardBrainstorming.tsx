"use client";
import { Brain, CircleArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CardBrainstorming() {
  return (
    <Card
      className="h-fit w-72 bg-gray-50"
      aria-label="Brainstorming Visualizer Card"
    >
      <CardHeader>
        <Brain
          size={64}
          color="black"
          strokeWidth={1}
          fill="white"
          aria-label="Brainstorming Icon"
          className="mb-4"
        />
        <CardTitle>Brainstorm Visualizer</CardTitle>
        <CardDescription>
          Visualize your ideas with dynamic brainstorming maps.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/brainstorming" aria-label="Go to Brainstorming Visualizer">
          <Button
            className="cursor-pointer"
            aria-label="Start Brainstorming Visualizer"
          >
            <div>Start</div>
            <CircleArrowRight />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
