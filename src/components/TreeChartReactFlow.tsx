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
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, Download } from "lucide-react";
import CustomNode from "./CustomNode"; // Adjust path if needed

// -------------------- Types --------------------

interface TreeNode {
  name: string;
  text?: string;
  children?: TreeNode[];
}

interface TreeChartProps {
  data: TreeNode;
}

const nodeTypes = {
  custom: CustomNode,
};

// ------------------ Main TreeChart ------------------

const TreeChart: React.FC<TreeChartProps> = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const nodeIdSet = new Set<string>(); // Track created node IDs

  let idCounter = 0; // Unique incremental ID

  // Recursive function to convert TreeNode to Flow elements
  const convertToFlow = (
    node: TreeNode,
    x: number,
    y: number,
    parentId?: string
  ): { nodes: Node[]; edges: Edge[] } => {
    const nodeId = `node-${idCounter++}`; // Global unique ID
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Only add node if not already created
    if (!nodeIdSet.has(nodeId)) {
      nodeIdSet.add(nodeId);
      newNodes.push({
        id: nodeId,
        type: "custom",
        data: { label: node.name, text: node.text },
        position: { x, y },
      });
    }

    // Create edge to parent if exists
    if (parentId) {
      newEdges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "beizer",
        style: {
          strokeWidth: 2,
          stroke: "#FF0072",
        },
      });
    }

    // Recursively process children
    if (node.children) {
      const totalChildren = node.children.length;
      const verticalSpacing = 160; // Adjust spacing
      const horizontalSpacing = 250;

      node.children.forEach((child, idx) => {
        const childX = x + horizontalSpacing;
        const childY = y + (idx - (totalChildren - 1) / 2) * verticalSpacing;

        const { nodes: childNodes, edges: childEdges } = convertToFlow(
          child,
          childX,
          childY,
          nodeId // Pass current node as parent
        );

        newNodes.push(...childNodes);
        newEdges.push(...childEdges);
      });
    }

    return { nodes: newNodes, edges: newEdges };
  };

  // Call convertToFlow inside useEffect
  useEffect(() => {
    if (!data) return;
    nodeIdSet.clear(); // Clear ID tracker before generating
    idCounter = 0; // Reset ID counter
    const { nodes: flowNodes, edges: flowEdges } = convertToFlow(data, 0, 0);
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [data, setNodes, setEdges]);

  // Handle user connections
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
        <Background />
      </ReactFlow>

      {/* Optional Zoom/Download */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button onClick={() => console.log("Zoom In")}>
          <ZoomIn />
        </Button>
        <Button onClick={() => console.log("Zoom Out")}>
          <ZoomOut />
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button onClick={() => console.log("Download JPG")}>
          JPG <Download />
        </Button>
      </div>
    </div>
  );
};

export default TreeChart;
