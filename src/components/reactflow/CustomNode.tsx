// CustomNode.tsx
import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data, counter }: any) => {
  const isLeftNode = data.positionType === "left";
  const isRoot = data.isRoot;
  return (
    <div className="bg-white border border-gray-400 rounded-lg shadow-md px-4 py-2 min-w-[120px] text-center relative">
      {/* Target handle (where connections come in) */}
      <Handle
        type="target"
        position={
          isRoot ? Position.Top : isLeftNode ? Position.Right : Position.Left
        }
        style={{ background: "#555", width: 10, height: 10 }}
      />
      {/* Node content */}
      <div className="flex flex-col">
        <input
          defaultValue={data.label}
          className="text-xl font-semibold"
        ></input>
        <input
          defaultValue={data.text}
          className="text-lg overflow-auto whitespace-nowrap w-full"
        ></input>
      </div>

      {/* Source handles (where connections go out) */}
      {isRoot ? (
        // Root node has both handles
        <>
          <Handle
            type="source"
            position={Position.Left}
            id="left"
            style={{ background: "#555", width: 10, height: 10 }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="right"
            style={{ background: "#555", width: 10, height: 10 }}
          />
        </>
      ) : (
        // Child nodes have opposite handles
        <>
          <Handle
            type="source"
            position={isLeftNode ? Position.Left : Position.Right}
            style={{ background: "#555", width: 10, height: 10 }}
          />
          <Handle
            type="source"
            position={isLeftNode ? Position.Right : Position.Left}
            style={{ display: "none" }} // Hidden secondary handle for connection flexibility
          />
        </>
      )}
    </div>
  );
};

export default CustomNode;
