import React, { useState } from "react";
import ReactQuill from "react-quill-new"; // ✅ use react-quill-new for React 19
import "react-quill-new/dist/quill.snow.css";

type CustomQuilTextEditorProps = {
    placeholder?: string;
    onChange?: (json: any) => void;
  };

const CustomQuilTextEditor: React.FC<CustomQuilTextEditorProps> = ({
    placeholder = "Start typing...",
    onChange,
  }) => {
  const [content, setContent] = useState<any>(null);

  // Minimal toolbar
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["image"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "image",
  ];

  return (
    <div className="w-full">
      <div className="relative border rounded-lg bg-[#f9fdfa] overflow-hidden">
        <ReactQuill
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="h-40"
          onChange={(_, __, ___, editor) => {
            const delta = editor.getContents(); // Delta JSON
          setContent(delta);
          onChange?.(delta); // ✅ emit JSON to parent
          }}
        />
      </div>
    </div>
  );
};

export default CustomQuilTextEditor;
