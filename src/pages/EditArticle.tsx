import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Mic,
  MoveLeft,
  Plus,
  Save,
  Send,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIcon, type HeaderKey } from "@/utils/HeaderIcons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import AudioPlayer from "@/components/ui/AudioPlayer";
import EditorRemarks from "@/components/EditorRemarks";

// ---------- Types ----------
type FormData = {
  category: string;
  name: string;
  content: string;
  tags: string[];
  video: File | null;
  audio: File | null;
  status: boolean | null;
};

const EditArticle = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split("/")[1];
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const handleBack = () => {
    if (from) {
      navigate(`/${from}`);
    }
  };
  const headerConfig: Record<
    string,
    { label: string; color: string; icon: HeaderKey }
  > = {
    textArticle: {
      label: "Text Article",
      color: "#2B7FFF",
      icon: "Text Article",
    },
    audio: { label: "Audio Post", color: "#ab3fff", icon: "audio" },
    video: { label: "Video Post", color: "#9f2e00", icon: "video" },
  };

  const activeConfig = headerConfig[path] ?? headerConfig.textArticle;

  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  console.log(errors);
  const [formData, setFormData] = useState<FormData>({
    category: "Politics",
    name: "",
    content: "",
    tags: [],
    video: null,
    audio: null,
    status: true,
  });

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      const updatedTags = [...formData.tags, newTag.trim()];
      setFormData({ ...formData, tags: updatedTags });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | Partial<FormData>,
    fromEvent = true
  ) => {
    if (fromEvent && "target" in e) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      const update = e as Partial<FormData>;
      setFormData({ ...formData, ...update });
    }
  };

  const validate = () => {
    const validateFile = (
      file: File | null,
      allowedExts: string[],
      sizeMB: number
    ) => {
      if (!file) return "File is required";
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const maxSize = sizeMB * 1024 * 1024;

      if (!allowedExts.includes(ext)) {
        return "Invalid format";
      }

      if (file.size > maxSize) {
        return `File must be less than ${sizeMB} MB`;
      }

      return null;
    };

    const newErrors: Record<string, string> = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (
      path === "textArticle" &&
      !formData.content.replace(/<p><br><\/p>/g, "").trim()
    ) {
      newErrors.content = "Content is required";
    }

    if (path === "audio") {
      const audioError = validateFile(
        formData.audio,
        [".mp3", ".wav", ".m4a"],
        100
      );
      if (audioError) newErrors.audio = audioError;
    }

    if (path === "video") {
      const videoError = validateFile(
        formData.video,
        [".mp4", ".mov", ".avi"],
        500
      );
      if (videoError) newErrors.video = videoError;
    }

    if (!formData.tags.length) {
      newErrors.tags = "Tags are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForReview = (e: React.FormEvent, status: boolean) => {
    e.preventDefault();
    if (validate()) {
      setFormData({ ...formData, status });
      console.log("✅ Status:", status);
      console.log("✅ Form submitted:", formData);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6faf6]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#f6faf6]  pt-[60px]">
        <div className="px-4 py-3 flex flex-col gap-[24px]">
          <div className="flex flex-row items-center gap-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="border border-[#E5E7EB] h-10 w-10  bg-[#F8FAF9] text-[#2C3E50] rounded-[8.5px]"
            >
              <MoveLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-[#E5E7EB] h-10 w-10 rounded-[8.5px]"
              style={{ backgroundColor: activeConfig.color }}
            >
              <HeaderIcon className="text-white" name="Text Article" />
            </Button>
            <p className="font-bold text-2xl">{activeConfig.label}</p>
            <div className="flex items-center gap-2 px-2 ml-auto">
              <Button
                form="myForm"
                type="submit"
                name="draft"
                variant="outline"
                size="sm"
                className="gap-2 border-[#B3E6B3] bg-[#F0F9F0] text-[#008001] hover:bg-[#F0F9F0] hover:text-[#008001]"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                form="myForm"
                type="submit"
                name="save"
                size="sm"
                className="bg-green-700 hover:bg-green-700 text-white gap-2"
              >
                <Send className="w-4 h-4" />
                Submit for Review
              </Button>
            </div>
          </div>
          <form
            id="myForm"
            onSubmit={(e) => {
              const action = (e.nativeEvent as SubmitEvent)
                .submitter as HTMLButtonElement;
              if (action?.name === "draft") {
                submitForReview(e, false);
              } else if (action?.name === "save") {
                submitForReview(e, true);
              }
            }}
          >
            <div className="bg-white  border-gray-200 px-8 py-6  shadow-md">
              <div className="flex items-center justify-between ">
                <h2 className="text-[20px] font-semibold">Content Editor</h2>
                <div className="flex gap-[12px]">
                  <span className="px-[12px] py-[4px] text-sm text-[#6A7282] rounded-lg bg-[#F8FAF9] border border-[#E5E7EB]">
                    Draft
                  </span>

                  <span className="px-[12px] py-[4px] text-sm text-[#006601] rounded-lg bg-[#f8faf9] border border-[#B3E6B3]">
                    Auto-saved
                  </span>
                </div>
              </div>
              <EditorRemarks />

              <div className="flex flex-col gap-[24px]">
                {/* Title */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Title</label>
                    <span>*</span>
                  </div>
                  <Input
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#f7fbf8] border-[#ECECEC] border"
                  />
                </div>

                {/* Content Editor */}
                {path === "textArticle" && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <label className="text-600 font-medium">Content</label>
                        <span className="text-600">*</span>
                      </div>

                      <CustomQuilTextEditor
                        selectedValue={formData.content}
                        placeholder="Write something..."
                        onChange={(json) =>
                          handleChange({ content: json }, false)
                        }
                      />
                    </div>
                  </>
                )}

                {/** Audio */}
                {path === "audio" && (
                  <>
                    {!formData.audio && (
                      <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] flex items-center justify-center">
                          <Mic className="h-6 w-6" />
                        </div>
                        <p className="mt-6 font-medium">Upload audio file</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Supports MP3, WAV, M4A (Max 100MB)
                        </p>
                        <label className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-xl cursor-pointer">
                          <Upload className="h-4 w-4" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept=".mp3,.wav,.m4a"
                            hidden
                            onChange={(e) =>
                              handleChange(
                                { audio: e.target.files?.[0] },
                                false
                              )
                            }
                          />
                        </label>
                        {/* {audioFile && <p className="mt-3 text-sm text-gray-700">Selected: {audioFile.name}</p>} */}
                      </div>
                    )}
                    {formData.audio && (
                      <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl text-center">
                        <AudioPlayer
                          src={formData.audio}
                          fileName={formData.audio?.fileName}
                        />
                      </div>
                    )}
                  </>
                )}

                {/**Video */}
                {path === "video" && (
                  <>
                    <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 text-[#9f2e00] flex items-center justify-center">
                        <Video className="h-6 w-6" />
                      </div>
                      <p className="mt-6 font-medium">Upload video</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Drag & drop your video file or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports MP4, MOV, AVI (Max 500MB)
                      </p>
                      <label className="inline-flex items-center gap-2 mt-6 bg-orange-700 text-white px-4 py-2 rounded-xl cursor-pointer">
                        <Upload className="h-4 w-4" />
                        <span>Choose File</span>
                        <input
                          type="file"
                          accept=".mp4,.mov,.avi"
                          hidden
                          onChange={(e) =>
                            handleChange({ video: e.target.files?.[0] }, false)
                          }
                        />
                      </label>
                      {/* {videoFile && <p className="mt-3 text-sm text-gray-700">Selected: {videoFile.name}</p>} */}
                    </div>
                  </>
                )}

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Tag</label>
                    <span>*</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <Input
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="py-[19px] border-[#ECECEC] border bg-[#f7fbf8]"
                      />
                      <Button
                        type="button"
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
                    {formData.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-2 px-3 py-1 text-[#008001] bg-[#f8faf9] border-[#B3E6B3]"
                      >
                        {tag}
                        <button
                          type="button"
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
          </form>
        </div>
      </header>
    </div>
  );
};

export default EditArticle;
