"use client";
import { LayoutGrid, CircleArrowRight } from "lucide-react";
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

export default function CardSwotAnalysis() {
  return (
    <Card className="h-fit w-72 bg-slate-50" aria-label="SWOT Analysis Card">
      <CardHeader>
        <LayoutGrid
          size={64}
          color="black"
          strokeWidth={1}
          fill="white"
          aria-label="SWOT Analysis Icon"
          className="mb-4"
        />
        <CardTitle>SWOT Analysis</CardTitle>
        <CardDescription>
          Identify strengths, weaknesses, opportunities, and threats.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href="/swotAnalysis" aria-label="Go to SWOT analyzer">
          <Button className="cursor-pointer" aria-label="Start SWOT Analysis">
            <div>Start</div>
            <CircleArrowRight />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
