"use client";

import React, { useEffect, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Node,
  Edge,
  useReactFlow,
  FitView,
  ControlButton,
} from "reactflow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "reactflow/dist/style.css";

import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, ArrowDownToLine } from "lucide-react";
import CustomNode from "./CustomNode"; // Adjust path if needed
import BrainstormPrompt from "../BrainstormPrompt";
import * as htmlToImage from "html-to-image";
import { Arrow } from "@radix-ui/react-tooltip";

// -------------------- Types --------------------

interface TreeNode {
  title: string;
  description?: string;
  children?: TreeNode[];
}

interface TreeChartProps {
  data: TreeNode;
  onGenerate: (input: string) => void;
  ideas: string | null;
}

const nodeTypes = {
  custom: CustomNode,
};

// -------------- Utility: Download PNG --------------
const downloadPNG = async () => {
  const reactFlowWrapper = document.querySelector(
    ".react-flow__viewport"
  ) as HTMLElement;
  if (!reactFlowWrapper) return;

  try {
    const dataUrl = await htmlToImage.toPng(reactFlowWrapper);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "tree_chart.png";
    link.click();
  } catch (error) {
    console.error("Error generating PNG:", error);
  }
};

// ------------------ Main TreeChart ------------------
const TreeChart: React.FC<TreeChartProps> = ({ data, onGenerate, ideas }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const nodeIdSet = new Set<string>(); // Track created node IDs
  const strokeColors = [
    "#FF9D46",
    "#FFC639",
    "#FE668C",
    "#42D1B5",
    "#40D4E2",
    "#41A3E0",
  ];
  let idCounter = 0; // Unique incremental ID

  // Recursive function to convert TreeNode to Flow elements
  // Update the convertToFlow function with this positioning logic
  const convertToFlow = (
    node: TreeNode,
    x: number,
    y: number,
    depth: number = 0,
    parentId?: string,
    strokeColor?: string
  ): { nodes: Node[]; edges: Edge[] } => {
    const nodeId = `node-${idCounter++}`;
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const isRoot = depth === 0;

    if (parentId == "node-0" || depth === 0) {
      const parentIndex = Math.floor(idCounter / 4);
      strokeColor = strokeColors[parentIndex];
    }

    if (!nodeIdSet.has(nodeId)) {
      nodeIdSet.add(nodeId);
      newNodes.push({
        id: nodeId,
        type: "custom",
        data: {
          title: node.title,
          description: node.description,
          positionType: x < 0 ? "left" : "right", // Add position type
          strokeColor,
          isRoot,
        },
        position: { x, y },
      });
    }

    if (parentId) {
      const handleId =
        parentId === "node-0" ? (idCounter < 11 ? "left" : "right") : undefined;

      newEdges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "bezier",
        sourceHandle: handleId, // Use left or right handle based on ID
        style: {
          strokeWidth: 2,
          stroke: strokeColor,
        },
      });
    }

    if (node.children) {
      const totalChildren = node.children.length;
      const verticalSpacing = depth === 0 ? 360 : 120;
      const horizontalSpacing = depth === 0 ? 400 : 360;

      node.children.forEach((child, idx) => {
        let childX = x;
        let childY = y;

        // First level children layout
        if (depth === 0) {
          const isLeft = idx < 3; // First 3 nodes on left
          const groupIndex = idx % 3;
          childX = isLeft ? x - horizontalSpacing : x + horizontalSpacing;
          childY = y + (groupIndex - 1) * verticalSpacing;
        }
        // Child nodes layout
        else {
          const direction = x < 0 ? "left" : "right";
          childX =
            direction === "left"
              ? x - horizontalSpacing
              : x + horizontalSpacing;
          childY = y + (idx - (totalChildren - 1) / 2) * verticalSpacing;
        }

        const { nodes: childNodes, edges: childEdges } = convertToFlow(
          child,
          childX,
          childY,
          depth + 1,
          nodeId,
          strokeColor
        );
        newNodes.push(...childNodes);
        newEdges.push(...childEdges);
      });
    }
    return { nodes: newNodes, edges: newEdges };
  };

  const { fitView } = useReactFlow();
  // Update the initial call in useEffect
  useEffect(() => {
    if (!data) return;
    nodeIdSet.clear();
    idCounter = 0;
    console.log(ideas);
    // Start root node at center position (0,0)
    const { nodes: flowNodes, edges: flowEdges } = convertToFlow(data, 0, 0);

    setNodes(flowNodes);
    setEdges(flowEdges);

    // Automatically fit and zoom out when everything is loaded
    setTimeout(() => {
      fitView({ padding: 0.3, duration: 500 }); // Adjust padding for more space
    }, 100);
  }, [ideas, setNodes, setEdges, fitView]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        snapToGrid={true} // Enable snapping
        snapGrid={[10, 10]}
        fitView
      >
        <MiniMap />
        <Controls
          className=""
          aria-label="React Flow Control Panel"
          showZoom={true}
          showInteractive={false}
          showFitView={true}
        >
          <ControlButton>
            <ArrowDownToLine strokeWidth={2.5} onClick={downloadPNG} />{" "}
          </ControlButton>
        </Controls>
        <Background size={1} />
      </ReactFlow>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex space-x-2">
        <BrainstormPrompt onGenerate={onGenerate} ideas={ideas} />
      </div>
    </div>
  );
};

export default TreeChart;
