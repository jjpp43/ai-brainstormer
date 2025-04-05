import React, { useRef, useEffect } from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data }: any) => {
  const isLeftNode = data.positionType === "left";
  const isRoot = data.isRoot;
  const colorClass = isRoot ? "#646464" : data.strokeColor || "black";
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
      className="h-fit bg-gray-50 border-2 rounded-lg shadow-md px-4 py-2 min-w-[120px] text-center relative"
    >
      {/* Target handle (where connections come in) */}
      <Handle
        type="target"
        position={isLeftNode ? Position.Right : Position.Left}
        style={{ background: colorClass, width: 8, height: 8 }}
      />
      {/* Node content */}

      <div className="flex flex-col">
        <input
          defaultValue={data.title}
          className={`w-full text-xl font-semibold ${
            isRoot ? "uppercase" : ""
          }`}
        />
        <textarea
          ref={textAreaRef}
          defaultValue={data.description}
          className="pt-1 text-lg w-full resize-none overflow-hidden"
          style={{ minHeight: "1.5em", lineHeight: "1.3" }} // Ensure single line initially
          onInput={(e) => autoResize(e.currentTarget)}
          rows={1} // Starts with one line
        />
      </div>
      {/* Source handles (where connections go out) */}
      {isRoot ? (
        <>
          <Handle
            id="left" // Add ID for left handle
            type="source"
            position={Position.Left}
            style={{ background: colorClass, width: 8, height: 8 }}
          />
          <Handle
            id="right" // Add ID for right handle
            type="source"
            position={Position.Right}
            style={{ background: colorClass, width: 8, height: 8 }}
          />
        </>
      ) : (
        <Handle
          type="source"
          position={isLeftNode ? Position.Left : Position.Right}
          style={{
            background: colorClass,
            width: 8,
            height: 8,
          }}
        />
      )}
    </div>
  );
};

export default CustomNode;
