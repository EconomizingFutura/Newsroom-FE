import { useLocation, useNavigate } from "react-router-dom";
import { Mic, Plus, Save, Send, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIcon } from "@/utils/HeaderIcons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import AudioPlayer from "@/components/ui/AudioPlayer";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Controller, useForm } from "react-hook-form";
import { API_LIST } from "@/api/endpoints";
import { GET, PATCH, POST } from "@/api/apiMethods";
import { useEffect } from "react";

interface TextArticleEditorProps {
  article?: any;
  onBack?: () => void;
  onNavigateToNewsFeeds?: () => void;
}

type FormData = {
  title: string;
  category: string;
  tags: string[];
  newTag: string;
  content: string;
  audio: File | null;
  video: File | null;
  status: string;
  reporterId: string | number | null;
  thumbnail: string;
};

const ContentUploader = ({}: TextArticleEditorProps) => {
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

  const submitForReview = async (data: FormData, e: any) => {
    const actionName = e.nativeEvent.submitter.name; // "draft" | "save"
    try {
      if (actionName.toLowerCase() === "draft") {
        if(reporterId){
          const response: any = await PATCH(API_LIST.BASE_URL + API_LIST.DRAFT_BY_ARTICLE + reporterId, data);
          setValue('reporterId', response.id);
        }else {
          const response: any = await POST(API_LIST.BASE_URL + API_LIST.DRAFT_ARTICLE, data);
          setValue('reporterId', response.id);
        }
      }
      else if (actionName.toLowerCase() === "save") {
        const response: any = await POST(API_LIST.SUBMIT_ARTICLE, data);
        console.log(response, 'POST1');
      }

      console.log("✅ Submitted:", data);
    } catch (err) {
      console.error("❌ Error:", err);
    }
  };

  const { register, handleSubmit,  reset, setValue, control, watch, formState: { errors }, } = useForm<FormData>({
    defaultValues: {
    title: "",
    category: "Politics",
    tags: [],
    newTag: "",
    content: "",
    audio: null,
    video: null,
    status: "",
    reporterId: null,
    thumbnail: "",
  }});

  const tags = watch("tags");
  const newTag = watch("newTag");
  const audio = watch("audio");
  const video = watch("video");
  const thumbnail = watch("thumbnail");
  const reporterId = watch("reporterId");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue("tags", [...tags, newTag.trim()]);
      setValue("newTag", "");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue( "tags", tags.filter((tag) => tag !== tagToRemove) );
  };

  useEffect(() => {
    reset({
      title: "",
      category: "Politics",
      tags: [],
      newTag: "",
      content: "",
      audio: null,
      video: null,
      status: "",
      reporterId: null,
      thumbnail: "",
    });
  }, [path, reset]);
  
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
          <form id="myForm" onSubmit={handleSubmit(submitForReview)} >
          <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-2xl shadow-md">
            <div className="flex items-center justify-between pt-[8px] pb-[32px]">
              <h2 className="text-lg font-medium">Content Editor</h2>
              <div className="flex gap-[12px]"> 
                {/* {formData.status.toLowerCase() == 'draft' && <span className="px-[12px] py-[4px] text-sm text-[#6A7282] rounded-lg bg-[#F8FAF9] border-1 border-[#E5E7EB]">Draft</span>}
                {formData.status.toLowerCase() == 'submitted' && <span className="px-[12px] py-[4px] text-sm text-[#006601] rounded-lg bg-[#f8faf9] border-1 border-[#B3E6B3]">Auto-saved</span>} */}
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
                    type="button"
                    key={category}
                    variant= {watch("category") === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setValue("category", category)}
                    className={`px-[24px] py-[6px] ${
                      watch("category") === category
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
                  placeholder="Title"
                  {...register("title", { required: "Title is required" })}
                  className={`bg-[#f7fbf8] border-[#ECECEC] border-1 ${errors.title?'border-red-500':''}`}
                />
              </div>
            
            {/* Content Editor */}
            {path === "textArticle" && ( <>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-600 font-medium">Content</label>
                  <span className="text-600">*</span>
                </div>

                <Controller
                  control={control}
                  name="content"
                  rules={{
                    validate: (value) => {
                      if (path === "textArticle" && !value || value.trim() === "<p><br></p>") {
                        return "Content is required";
                      }
                    }
                  }}
                  render={({ field }) => (
                    <CustomQuilTextEditor
                      selectedValue={field.value}
                      onChange={field.onChange}
                      placeholder="Write something..."
                    />
                  )}
                />
              </div>
            </>)}

              {/** Audio */}
              {path === "audio" && ( <>
                {!audio && <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] flex items-center justify-center">
                    <Mic className="h-6 w-6" />
                  </div>
                  <p className="mt-6 font-medium">Upload audio file</p>
                  <p className="text-sm text-gray-500 mt-1">Supports MP3, WAV, M4A (Max 100MB)</p>
                  <label className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-xl cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                    <input type="file" accept=".mp3,.wav,.m4a" hidden 
                    {...register("audio", {
                      validate: (file) => {
                        if (path === "audio" && !file) {
                          return "Audio is required";
                        }
                        return true;
                      },
                    })}
                    onChange={(e) => setValue("audio", e.target.files?.[0] || null)}/>
                  </label>
                </div>}
                {audio && 
                  <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl text-center">
                    <AudioPlayer src={audio} fileName='' />
                  </div>
                }
                </>
              )}
              
                {/**Video */}
                {path === "video" && ( <>
                  {!video &&<div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 text-[#9f2e00] flex items-center justify-center">
                      <Video className="h-6 w-6" />
                    </div>
                    <p className="mt-6 font-medium">Upload video</p>
                    <p className="text-sm text-gray-500 mt-1">Drag & drop your video file or click to browse</p>
                    <p className="text-sm text-gray-500">Supports MP4, MOV, AVI (Max 500MB)</p>
                    <label className="inline-flex items-center gap-2 mt-6 bg-orange-700 text-white px-4 py-2 rounded-xl cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Choose File</span>
                      <input type="file" accept=".mp4,.mov,.avi" hidden 
                      {...register("video", {
                        validate: (file) => {
                          if (path === "video" && !file) {
                            return "Video is required";
                          }
                          return true;
                        },
                      })}
                      onChange={(e) => setValue("video", e.target.files?.[0] || null)}/>
                    </label>
                  </div>}
                  {video && 
                  <VideoPlayer 
                    src={video}
                    onThumbnailGenerated={(thumb) => setValue("thumbnail", thumb)}
                    onDelete={() => {
                      setValue("video", null);
                      setValue("thumbnail", "");
                    }}
                  />
                  }
                </>)}

                {path === "video" && ( <>      
              <div>
                <label className="block text-sm font-medium">Thumbnail Preview</label>
                <div className="mt-2 h-28 w-full bg-gray-100 rounded-xl">
                {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Generated Thumbnail"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
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
                        {...register("newTag")}
                        placeholder="Add tag"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="py-[19px] border-[#ECECEC] border-1 bg-[#f7fbf8]"
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
                      <Controller
                        name="tags"
                        control={control}
                        rules={{
                          validate: (tags) => tags.length > 0 || "At least one tag is required",
                        }}
                        render={({ field }) => (
                          <>
                            {field.value.map((tag: string, index: number) => (
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
                          </>
                        )}
                      />
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

export default ContentUploader;
