import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import "./TextArticleTest.css";
import TextEditor from "@/components/TextEditor";

const ArticleEditor: React.FC = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Start writing your article...</p>",
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-gray-700">Create Text Article</h2>
          <div className="space-x-2">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
              Save Draft
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Submit for Review
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4">
          {["Politics", "Business", "Entertainment", "Sports", "Environment"].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg text-sm font-medium border hover:bg-green-100"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Toolbar */}
        {editor && (
          <div className="flex flex-wrap gap-2 mb-3 border-b pb-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">B</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn italic">I</button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn underline">U</button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className="btn line-through">S</button>
            <button onClick={() => editor.chain().focus().setParagraph().run()} className="btn">P</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H2</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="btn">H3</button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• List</button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn">1. List</button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="btn">❝</button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="btn">─</button>
            <button onClick={() => editor.chain().focus().setImage({ src: prompt("Image URL") || "" }).run()} className="btn">🖼</button>
            <button onClick={() => editor.chain().focus().undo().run()} className="btn">↶</button>
            <button onClick={() => editor.chain().focus().redo().run()} className="btn">↷</button>
          </div>
        )}

        {/* Content Editor */}
        <div className="border rounded-lg min-h-[300px] p-3">
          <EditorContent editor={editor} />
        </div>

        {/* Tags */}
        <div className="mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="border px-3 py-2 rounded-lg flex-1"
            />
            <button onClick={addTag} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              + Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                {tag} ✕
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
