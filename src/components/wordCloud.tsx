"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import cloud from "d3-cloud";

interface WordCloudProps {
  words: string[];
  width?: number;
  height?: number;
  fontScale?: number;
  maxWords?: number;
  fontFamily?: string;
  rotate?: () => number;
  padding?: number;
  colors?: string[];
}

const WordCloud: React.FC<WordCloudProps> = ({
  words,
  width = 600,
  height = 200,
  fontScale = 15,
  maxWords = 100,
  fontFamily = "sans-serif",
  rotate = () => (Math.random() > 0.5 ? 0 : 0),
  padding = 1,
  colors = ["#364152", "#FCBA04", "#008DD5", "#F45B69"],
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!words.length) return;

    const wordCounts = d3
      .rollups(
        words,
        (v) => v.length,
        (w) => w
      )
      .sort(([, a], [, b]) => d3.descending(a, b))
      .slice(0, maxWords)
      .map(([text, size]) => ({ text, size }));

    const layout = cloud()
      .size([width, height])
      .words(
        wordCounts.map((d) => ({
          text: d.text,
          size: Math.sqrt(d.size) * fontScale,
        }))
      )
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize((d) => d.size as number)
      .on("end", draw);

    layout.start();

    function draw(
      words: {
        text: string;
        size: number;
        x: number;
        y: number;
        rotate: number;
      }[]
    ) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); // Clear previous words

      const g = svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      g.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("fill", (_, i) => colors[i % colors.length])
        .attr("text-anchor", "middle")
        .attr(
          "transform",
          (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`
        )
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", fontFamily)
        .text((d) => d.text);
    }
  }, [
    words,
    width,
    height,
    fontScale,
    maxWords,
    fontFamily,
    rotate,
    padding,
    colors,
  ]);

  return <svg ref={svgRef} />;
};

export default WordCloud;
