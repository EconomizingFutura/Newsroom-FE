import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new"; // ✅ use react-quill-new for React 19
import "react-quill-new/dist/quill.snow.css";

type CustomQuilTextEditorProps = {
  placeholder?: string;
  onChange?: (json: any) => void;
  selectedValue?: string;
  readOnly?: boolean;
};

const CustomQuilTextEditor: React.FC<CustomQuilTextEditorProps> = ({
  placeholder = "Start typing...",
  onChange,
  selectedValue,
  readOnly
}) => {
  const [content, setContent] = useState<any>(selectedValue);

  useEffect(() => {
    setContent(selectedValue || "");
  }, [selectedValue]);

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
          readOnly={readOnly}
          value={content}
          modules={modules}

          //   modules={readOnly ? modules : { toolbar: false }}
          formats={formats}
          placeholder={placeholder}
          className="h-40"
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
