import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new"; // ✅ use react-quill-new for React 19
import "react-quill-new/dist/quill.snow.css";
import { cn } from "./utils";
import "./quillTextEditor.css";

type CustomQuilTextEditorProps = {
  placeholder?: string;
  onChange?: (json: any) => void;
  selectedValue?: string;
  readOnly?: boolean;
  className?: string;
};

const CustomQuilTextEditor: React.FC<CustomQuilTextEditorProps> = ({
  placeholder = "Start typing...",
  onChange,
  selectedValue,
  readOnly,
  className,
}) => {
  const [content, setContent] = useState<string | undefined>(selectedValue);

  useEffect(() => {
    setContent(selectedValue || "");
  }, [selectedValue]);

  // Minimal toolbar
  const modules = {
    toolbar: [["bold", "italic", "underline", "strike"], ["image"]],
  };

  const formats = ["bold", "italic", "underline", "strike", "image"];

  return (
    <div className={cn("w-full h-full", readOnly && "pt-6")}>
      <div
        className={cn(
          "relative  rounded-lg bg-[#F7FBF7] overflow-hidden",
          readOnly ? "border border-transparent" : "border border-[#ECECEC]"
        )}
      >
        <ReactQuill
          readOnly={readOnly}
          value={content}
          // modules={modules}
          modules={!readOnly ? modules : { toolbar: false }}
          formats={formats}
          placeholder={placeholder}
          className={cn(
            " bg-amber-300 overflow-y-auto",
            className,
            !readOnly ? "h-56" : "h-56 no-toolbar"
          )}
          onChange={(_, __, ___, editor) => {
            const delta = editor.getHTML(); // Delta JSON
            setContent(delta);
            onChange?.(delta); // ✅ emit JSON to parent
          }}
        />
      </div>
    </div>
  );
};

export default CustomQuilTextEditor;
