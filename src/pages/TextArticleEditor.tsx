import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import ContentHeader from "@/components/ContentHeader";

interface TextArticleEditorProps {
  article?: any;
  onBack?: () => void;
  onNavigateToNewsFeeds?: () => void;
}

export default function TextArticleEditor({
  article,
  onBack,
}: TextArticleEditorProps) {
  console.log('coming inside edit artivle')
  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(
    article?.content ||
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
  );
  const [selectedCategory, setSelectedCategory] = useState("Politics");
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [newTag, setNewTag] = useState("");

  const categories = [
    "Politics",
    "Business",
    "Entertainment",
    "Sports",
    "Environment",
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };

  return (
    <div className=" flex-1 h-screen py-16 bg-gray-50">
      {/* Main Content */}
      <div className=" flex flex-col">
        <ContentHeader
          text="Text Article"
          showArticle
          showSaveSubmit
          onClickBack={onBack}
          showBackButton
          onClickSubmitSave={[
            () => console.log("Save"),
            () => console.log("Submit"),
          ]}
        />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6 space-y-6 flex-1">
          {/* Content Editor Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Content Editor</h2>
            <span className="text-sm text-gray-500">Auto-saved</span>
          </div>

          {/* Editor Remarks */}
          <Card className="border-red-200 bg-red-50">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border border-red-400 rounded-sm flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-red-400 rounded-sm"></div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Editor Remarks
                  </h3>
                  <p className="text-sm text-red-700">
                    Needs fact verification for the statistics mentioned in
                    paragraph 3. Please add sources for the economic data.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Category Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Select Category</label>
              <span className="text-red-500">*</span>
            </div>

            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Title</label>
              <span className="text-red-500">*</span>
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Content</label>
              <span className="text-red-500">*</span>
            </div>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-96 bg-white resize-none"
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Tag</label>
              <span className="text-red-500">*</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Input
                placeholder="Name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-32 bg-white"
              />

              <Button
                size="sm"
                onClick={handleAddTag}
                className="bg-green-600 hover:bg-green-700 gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 gap-2 px-3 py-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
