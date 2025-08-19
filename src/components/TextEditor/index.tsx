import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import TextAlign from "@tiptap/extension-text-align";
//import "./TextEditor.css";

const TextEditor: React.FC = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Underline,
      Italic,
      Strike,
      Image,
      Link,
      Blockquote,
      CodeBlock,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: `<p>Start writing your article...</p>`,
  });

  return (
    <div className="border border-gray-300 rounded-lg shadow-md bg-white">
      <div className="p-2 border-b border-gray-200 flex items-center gap-2 bg-gray-50">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "is-active" : ""}
        >
          B
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "is-active" : ""}
        >
          I
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive("underline") ? "is-active" : ""}
        >
          U
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={editor?.isActive("strike") ? "is-active" : ""}
        >
          S
        </button>
      </div>
      <div className="min-h-[300px] p-4 prose prose-sm max-w-none focus:outline-none">
        {/* TipTap Editor Content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;
