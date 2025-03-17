"use client";

import * as d3 from "d3";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface TreeChartProps {
  data: TreeNode;
  width?: number;
  height?: number;
}

const TreeChart: React.FC<TreeChartProps> = ({
  data,
  width = 1280,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !gRef.current) return;

    const dx = 40;
    const dy = (width * 4) / (data.children ? data.children.length : 1);

    const root = d3.hierarchy<TreeNode>(data);
    const tree = d3.tree<TreeNode>().nodeSize([dx, dy]);
    tree(root);

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    g.selectAll("*").remove();

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    const linkGenerator = d3
      .linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => d.x);

    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", (d) => linkGenerator(d))
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    const node = g
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    node
      .append("circle")
      .attr("fill", (d) => (d.children ? "#222" : "#555"))
      .attr("r", 5);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.children ? -10 : 10))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name)
      .attr("stroke", "white")
      .attr("paint-order", "stroke")
      .attr("font-size", "24px");
  }, [data, width, height]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.2);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.8);
    }
  };

  const handleDownload = useCallback(async (format: "png" | "jpg") => {
    if (!svgRef.current || !gRef.current) return;

    const svgElement = svgRef.current;
    const gElement = gRef.current;
    const padding = 20;
    const scaleFactor = 3;

    // Get transformed dimensions
    const bbox = gElement.getBBox();
    const transform = gElement.getScreenCTM()!;

    const adjustedBBox = {
      x: bbox.x * transform.a + transform.e,
      y: bbox.y * transform.d + transform.f,
      width: bbox.width * transform.a,
      height: bbox.height * transform.d,
    };

    // Create temporary SVG
    const tempSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    tempSvg.setAttribute(
      "viewBox",
      `${adjustedBBox.x - padding} ${adjustedBBox.y - padding} 
      ${adjustedBBox.width + 2 * padding} ${adjustedBBox.height + 2 * padding}`
    );
    tempSvg.setAttribute(
      "width",
      (adjustedBBox.width + 2 * padding).toString()
    );
    tempSvg.setAttribute(
      "height",
      (adjustedBBox.height + 2 * padding).toString()
    );

    // Clone and transform content
    const clonedG = gElement.cloneNode(true) as SVGGElement;
    clonedG.setAttribute(
      "transform",
      `translate(${transform.e}, ${transform.f}) scale(${transform.a})`
    );
    tempSvg.appendChild(clonedG);

    // Serialize and convert
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(tempSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      canvas.width = (adjustedBBox.width + 2 * padding) * scaleFactor;
      canvas.height = (adjustedBBox.height + 2 * padding) * scaleFactor;

      if (format === "jpg") {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const dataUrl = canvas.toDataURL(
        `image/${format === "jpg" ? "jpeg" : "png"}`,
        1.0
      );
      const link = document.createElement("a");
      link.download = `tree.${format}`;
      link.href = dataUrl;
      link.click();
    };

    img.src = url;
  }, []);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="border rounded-lg bg-white"
      >
        <g ref={gRef} />
      </svg>

      <div className="absolute top-4 right-4 flex space-x-2">
        <Button onClick={handleZoomIn}>
          <ZoomIn className="" />
        </Button>
        <Button onClick={handleZoomOut}>
          <ZoomOut className="" />
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        {/* <Button onClick={() => handleDownload("png")}>
          PNG <Download className="ml-2" />
        </Button> */}
        <Button onClick={() => handleDownload("jpg")}>
          JPG <Download className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TreeChart;
