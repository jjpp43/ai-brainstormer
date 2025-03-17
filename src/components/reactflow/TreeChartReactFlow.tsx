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
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, Download } from "lucide-react";
import CustomNode from "./CustomNode"; // Adjust path if needed
import BrainstormPrompt from "../BrainstormPrompt";

// -------------------- Types --------------------

interface TreeNode {
  name: string;
  text?: string;
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

// ------------------ Main TreeChart ------------------

const TreeChart: React.FC<TreeChartProps> = ({ data, onGenerate, ideas }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const nodeIdSet = new Set<string>(); // Track created node IDs
  const strokeColors = [
    "#FF0072", // Pink
    "#00BFFF", // Deep Sky Blue
    "#32CD32", // Lime Green
    "#FFA500", // Orange
    "#8A2BE2", // Blue Violet
    "#4262FF", // Orange Red
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
    console.log(parentId, idCounter);

    if (!nodeIdSet.has(nodeId)) {
      nodeIdSet.add(nodeId);
      newNodes.push({
        id: nodeId,
        type: "custom",
        data: {
          label: node.name,
          text: node.text,
          positionType: x < 0 ? "left" : "right", // Add position type
        },
        position: { x, y },
      });
    }
    if (parentId == "node-0") {
      const parentIndex = Math.floor(idCounter / 4);
      strokeColor = strokeColors[parentIndex];
    }
    if (parentId) {
      newEdges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "beizer",
        style: {
          strokeWidth: 2,
          stroke: strokeColor,
        },
      });
    }

    if (node.children) {
      const totalChildren = node.children.length;
      const verticalSpacing = depth === 0 ? 300 : 100;
      const horizontalSpacing = depth === 0 ? 400 : 320;

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

  // Update the initial call in useEffect
  useEffect(() => {
    if (!data) return;
    nodeIdSet.clear();
    idCounter = 0;

    // Start root node at center position (0,0)
    const { nodes: flowNodes, edges: flowEdges } = convertToFlow(data, 0, 0);

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [data, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-full border rounded-lg bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background size={1} />
      </ReactFlow>

      <div className="absolute top-2 left-4 flex space-x-2">
        <BrainstormPrompt onGenerate={onGenerate} ideas={ideas} />
      </div>

      <div className="absolute top-2 right-2 flex space-x-2">
        <Button>
          <ZoomIn />
        </Button>
        <Button onClick={() => console.log("Zoom Out")}>
          <ZoomOut />
        </Button>
      </div>

      <div className="absolute bottom-2 right-2 flex space-x-2">
        <Button onClick={() => console.log("Download JPG")}>
          JPG <Download />
        </Button>
      </div>
    </div>
  );
};

export default TreeChart;
