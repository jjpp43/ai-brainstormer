import React, { useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data }: any) => {
  const isLeftNode = data.positionType === "left";
  const isRoot = data.isRoot;
  const colorClass = data.strokeColor || "black";
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // Function to auto-resize textarea
  const autoResize = (element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = "auto"; // Reset height to recalculate
      element.style.height = `${element.scrollHeight}px`; // Set to scroll height
    }
  };

  useEffect(() => {
    autoResize(textAreaRef.current);
  }, []);

  return (
    <div
      style={{ borderColor: colorClass }}
      className="h-fit bg-white border-2 rounded-lg shadow-md px-4 py-2 min-w-[120px] text-center relative"
    >
      {/* Target handle (where connections come in) */}
      <Handle
        type="target"
        position={isLeftNode ? Position.Right : Position.Left}
        style={{ background: "#555", width: 0, height: 0 }}
      />
      {/* Node content */}
      <div className="flex flex-col">
        {isRoot ? (
          <input defaultValue={data.label} className="text-2xl font-semibold" />
        ) : (
          <input defaultValue={data.label} className="text-xl font-semibold" />
        )}

        {!isRoot && (
          <textarea
            ref={textAreaRef}
            defaultValue={data.text}
            className="text-lg w-full resize-none overflow-hidden"
            style={{ minHeight: "1.5em" }} // Ensure single line initially
            onInput={(e) => autoResize(e.currentTarget)}
            rows={1} // Starts with one line
          />
        )}
      </div>

      {/* Source handles (where connections go out) */}
      {isRoot ? (
        <>
          <Handle
            id="left" // Add ID for left handle
            type="source"
            position={Position.Left}
            style={{ background: "#555", width: 0, height: 0 }}
          />
          <Handle
            id="right" // Add ID for right handle
            type="source"
            position={Position.Right}
            style={{ background: "#555", width: 0, height: 0 }}
          />
        </>
      ) : (
        <Handle
          type="source"
          position={isLeftNode ? Position.Left : Position.Right}
          style={{ background: "#555", width: 0, height: 0 }}
        />
      )}
    </div>
  );
};

export default CustomNode;
