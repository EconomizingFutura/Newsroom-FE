import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mic, Save, Send, Play, X, Plus, Bell } from "lucide-react";

interface AudioArticleEditorProps {
  article?: any;
  onBack?: () => void;
  onNavigateToNewsFeeds?: () => void;
}

export default function AudioArticleEditor({
  article,
  onBack,
}: AudioArticleEditorProps) {
  const [title, setTitle] = useState(
    article?.title || "Climate Change Report: Impact on Local Communities"
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
    <div className="flex-1 h-screen bg-gray-50">
      <div className=" flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-medium">Audio Article</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <span className="text-sm text-gray-600">User Reporter</span>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit for Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Content Editor Header */}
          <div className="flex items-center py-4 justify-between">
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

          {/* Audio File Section */}
          <div className="space-y-4">
            <Card className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mic className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">File Name 1</h3>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-[#008001] border-green-200 hover:bg-green-50"
                >
                  <Play className="w-4 h-4" />
                  Play Audio
                </Button>
              </div>
            </Card>
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
