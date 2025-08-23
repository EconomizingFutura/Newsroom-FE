import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, Plus, Save, Send, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIcon } from "@/utils/HeaderIcons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";

interface TextArticleEditorProps {
  article?: any;
  onBack?: () => void;
  onNavigateToNewsFeeds?: () => void;
}

const ContentUploader = ({
  article,
  onBack,
}: TextArticleEditorProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // derive current path from router
  const path = location.pathname.replace("/", ""); // textArticle | audio | video

  const tabs = [
    { id: "textArticle", name: "Text Article" },
    { id: "audio", name: "Audio Post" },
    { id: "video", name: "Video Post" },
  ];

  // header config by path
  const headerConfig: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    textArticle: { label: "Create Text Article", color: "#2B7FFF", icon: "Text Article" },
    audio: { label: "Create Audio Post", color: "#ab3fff", icon: "audio" },
    video: { label: "Create Video Post", color: "#9f2e00", icon: "video" },
  };

  const activeConfig = headerConfig[path] ?? headerConfig.textArticle;

  const categories = [
    "Politics",
    "Business",
    "Entertainment",
    "Sports",
    "Environment",
  ];

  const getInitialState = (path: string, article?: any) => {
    return {
      title: article?.title || "",
      category: "Politics",
      tags: ["Tag 1", "Tag 2", "Tag 3"],
      newTag: "",
      editorContent: path === "textArticle" ? article?.content || null : null,
      audioFile: null,
      videoFile: null,
    };
  };

  const [content, setContent] = useState(
    article?.content ||
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
  );
  const [selectedCategory, setSelectedCategory] = useState("Politics");
  const [tags, setTags] = useState(["Tag 1", "Tag 2", "Tag 3"]);
  const [newTag, setNewTag] = useState("");
  const [title, setTitle] = useState(article?.title || "");
  const [editorContent, setEditorContent] = useState<any>(null);
  
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
    <div className="min-h-screen bg-[#f6faf6]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#f6faf6] border-b pt-[60px]">
        <div className="px-4 py-3 flex flex-col gap-[24px]">
          {/* Top row: icon + title + actions */}
          <div className="flex flex-row items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={`border border-[#E5E7EB] h-10 w-10 rounded-[8.5px]`}
              style={{ backgroundColor: activeConfig.color }}
            >
              <HeaderIcon className="text-white" name={activeConfig.icon} />
            </Button>
            <p className="font-bold text-2xl">{activeConfig.label}</p>
            <div className="flex items-center gap-2 px-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-[#B3E6B3] bg-[#F0F9F0] text-[#008001] hover:bg-[#F0F9F0] hover:text-[#008001]"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                size="sm"
                className="bg-[#7bbe7c] text-white hover:bg-green-700 gap-2"
              >
                <Send className="w-4 h-4" />
                Submit for Review
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-2xl shadow-md">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              {tabs.map((tab) => {
                const isActive = path === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/${tab.id}`)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form  */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-2xl shadow-md">
            <div className="flex items-center justify-between pt-[8px] pb-[32px]">
              <h2 className="text-lg font-medium">Content Editor</h2>
              <div className="flex gap-[12px]"> 
                <span className="px-[12px] py-[4px] text-sm text-[#6A7282] rounded-lg bg-[#F8FAF9] border-1 border-[#E5E7EB]">Draft</span>
                <span className="px-[12px] py-[4px] text-sm text-[#006601] rounded-lg bg-[#f8faf9] border-1 border-[#B3E6B3]">Auto-saved</span>
              </div>
            </div>

            <div className="flex flex-col gap-[24px]">
              <div>
              <div className="flex items-center gap-2 mb-[8px]">
                <label className="text-600 font-medium">Select Category</label>
                <span className="text-600">*</span>
              </div>

              <div className="flex gap-[12px] flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-[24px] py-[6px] ${
                      selectedCategory === category
                        ? " bg-[#008001] hover:bg-green-700"
                        : "bg-[#F8FAF9]"}
                    `}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-600 font-medium">Title</label>
                  <span className="text-600">*</span>
                </div>

                <Input
                placeholder="Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[#f7fbf8] border-[#ECECEC] border-1"
                />
              </div>
            
            {/* Content Editor */}
            {path === "textArticle" && ( <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-600 font-medium">Content</label>
                  <span className="text-600">*</span>
                </div>

                <CustomQuilTextEditor
                    placeholder="Write something..."
                    onChange={(json) => setEditorContent(json)}
                  />
              </div>
            </>)}

              {/** Audio */}
              {path === "audio" && ( <>
                <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] flex items-center justify-center">
                    <Mic className="h-6 w-6" />
                  </div>
                  <p className="mt-6 font-medium">Or Upload audio file</p>
                  <p className="text-sm text-gray-500 mt-1">Supports MP3, WAV, M4A (Max 100MB)</p>
                  <label className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-xl cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                    <input type="file" accept="audio/mpeg,audio/wav,audio/x-m4a,audio/mp4" hidden />
                  </label>
                  {/* {audioFile && <p className="mt-3 text-sm text-gray-700">Selected: {audioFile.name}</p>} */}
                </div>
                </>
              )}
              
                {/**Video */}
                {path === "video" && ( <>
                  <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 text-[#9f2e00] flex items-center justify-center">
                      <Video className="h-6 w-6" />
                    </div>
                    <p className="mt-6 font-medium">Or Upload video</p>
                    <p className="text-sm text-gray-500 mt-1">Drag & drop your video file or click to browse</p>
                    <p className="text-sm text-gray-500">Supports MP4, MOV, AVI (Max 500MB)</p>
                    <label className="inline-flex items-center gap-2 mt-6 bg-orange-700 text-white px-4 py-2 rounded-xl cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Choose File</span>
                      <input type="file" accept="video/mp4,video/x-m4v,video/*" hidden />
                    </label>
                    {/* {videoFile && <p className="mt-3 text-sm text-gray-700">Selected: {videoFile.name}</p>} */}
                  </div>
                </>)}

                {path === "video" && ( <>      
              <div>
                <label className="block text-sm font-medium">Thumbnail Preview</label>
                <div className="mt-2 h-28 w-full bg-gray-100 rounded-xl" />
              </div>
      </>)}

        {/* Tags Section */}
        <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-600 font-medium">Tag</label>
                      <span className="text-600">*</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative w-full">
                        <Input
                          placeholder="Add tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="py-[19px] border-[#ECECEC] border-1 bg-[#f7fbf8]"
                        />
                        <Button
                          size="sm"
                          onClick={handleAddTag}
                          className="absolute top-[6px] right-[12px] bg-[#006601] hover:bg-[#006601] px-[16px] py-[6px] gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-2 px-3 py-1 text-[#008001] bg-[#f8faf9] border-[#B3E6B3]"
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
      </header>
    </div>
  );
};

export default ContentUploader;
