import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data }: any) => {
  return (
    <div className="bg-white border border-gray-400 rounded-lg shadow-md px-4 py-2 min-w-[120px] text-center relative">
      {/* Left connection handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555", width: 10, height: 10 }}
      />
      {/* Node content */}
      <div>
        <div className="text-xl font-semibold">{data.label}</div>
        <div className="text-lg">{data.text}</div>
      </div>
      {/* Right connection handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555", width: 10, height: 10 }}
      />
    </div>
  );
};

export default CustomNode;
