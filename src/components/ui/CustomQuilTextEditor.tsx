import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "./utils";
import "./quillTextEditor.css";

type CustomQuilTextEditorProps = {
  placeholder?: string;
  onChange?: (json: any) => void;
  selectedValue?: string;
  readOnly?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
};

const CustomQuilTextEditor: React.FC<CustomQuilTextEditorProps> = ({
  placeholder = "Start typing...",
  onChange,
  selectedValue,
  readOnly,
  className,
  minHeight = 150,
  maxHeight = 600,
  defaultHeight = 250,
}) => {
  const [content, setContent] = useState<string | undefined>(selectedValue);
  const [height, setHeight] = useState(defaultHeight);
  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    setContent(selectedValue || "");
  }, [selectedValue]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizing.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newHeight = Math.min(
      Math.max(startHeight.current + (e.clientY - startY.current), minHeight),
      maxHeight
    );
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const modules = {
    toolbar: [["bold", "italic", "underline", "strike"], ["image"]],
  };

  const formats = ["bold", "italic", "underline", "strike", "image"];

  return (
    <div
      className={cn("relative w-full")}
      style={{ height: height + 10, overflow: "visible" }}
    >
      <div
        className={cn(
          "rounded-lg h-full border",
          readOnly ? "border border-transparent" : "border border-[#ECECEC]"
        )}
        style={{
          overflow: "visible",
          position: "relative",
          height: height,
        }}
      >
        <ReactQuill
          readOnly={readOnly}
          value={content}
          modules={!readOnly ? modules : { toolbar: false }}
          formats={formats}
          placeholder={placeholder}
          className={cn(
            "h-full !text-[14px]",
            className,
            !readOnly
              ? "bg-[#F7FBF7]"
              : "text-[#4A5565] no-toolbar bg-transparent"
          )}
          onChange={(_, __, ___, editor) => {
            const delta = editor.getHTML(); // Delta JSON
            setContent(delta);
            onChange?.(delta); // ✅ emit JSON to parent
          }}
        />
      </div>

      {/* ✅ SVG Grip Handle - always visible */}
      {!readOnly && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 flex items-center justify-center cursor-ns-resize z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="8"
            viewBox="0 0 24 8"
            fill="none"
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <circle cx="3" cy="4" r="1.5" fill="#9CA3AF" />
            <circle cx="8" cy="4" r="1.5" fill="#9CA3AF" />
            <circle cx="13" cy="4" r="1.5" fill="#9CA3AF" />
            <circle cx="18" cy="4" r="1.5" fill="#9CA3AF" />
            <circle cx="23" cy="4" r="1.5" fill="#9CA3AF" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default CustomQuilTextEditor;
