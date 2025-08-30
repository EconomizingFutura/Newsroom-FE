import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, Plus, Save, Send, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIcon } from "@/utils/HeaderIcons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import AudioPlayer from "@/components/ui/AudioPlayer";
import axios from "axios";
import { API_LIST } from "@/api/endpoints";
import VideoPlayer from "@/components/ui/VideoPlayer";

interface TextArticleEditorProps {
  article?: any;
  onBack?: () => void;
  onNavigateToNewsFeeds?: () => void;
}

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

  const getInitialState = () => {
    return {
      title: "",
      category: "Politics",
      tags: [],
      newTag: "",
      content: '',
      audio: null,
      video: null,
      status: '',
      reporterId: null,
      thumbnail: ''
    };
  };
  
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setNewTag("");
      handleChange({tags: [...formData.tags, newTag.trim()]}, false)
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    formData.tags = formData.tags.filter((tag) => tag !== tagToRemove)
    handleChange({tags: formData.tags}, false)
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const [formData, setFormData] = useState(getInitialState());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>|any, fromEvent=true) => {
    if(fromEvent){
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    else{
      const key = Object.keys(e)[0]; 
      const value = e[key];      
      setFormData({ ...formData, [key]:value });
    }
  };

  const validate = () => {
    const validateFile = (file: any, allowedExts: Array<string>, size: number) => {
      if (!file) return "File is required";
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const maxSize = size * 1024 * 1024;
  
      if (!allowedExts.includes(ext)) {
       return "Invalid format";
      }
  
      if (file.size > maxSize) {
        return "File must be less than 100 MB";
      }
    }
    let newErrors: { [key: string]: string } = {};

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (path === "textArticle" && !formData.content.replace(/<p><br><\/p>/g, "").trim()) {
      newErrors.content = "Content is required";
    }

    if (path === "audio") {
      const audioError = validateFile(formData.audio, [".mp3", ".wav", ".m4a"], 100);
      
      if(audioError)
        newErrors.audio = audioError;
    }

    if (path === "video") {
      const videoError = validateFile(formData.video, [".mp3", ".wav", ".m4a"], 500);
      
      if(videoError)
        newErrors.audio = videoError;
    }

    if (!formData.tags.length) {
      newErrors.tags = "Tags is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForReview = async (e: React.FormEvent, actionName: string) => {
    e.preventDefault();
    if (validate()) {
      try {
        const token = localStorage.getItem("token");
        localStorage.setItem("token", token??'');
        let apiUrl;

        if (actionName.toLowerCase() === "draft") {
          if (formData.reporterId) {
            // fetch existing draft
            apiUrl = `${API_LIST.DRAFT_BY_ARTICLE}${formData.reporterId}`;
            const res = await axios.patch(API_LIST.BASE_URL + apiUrl, formData, {
              headers: {
                Authorization: `Bearer ${token}`, // attach JWT
              },
            });
            if (res.data) {
              const data = res.data;
              setFormData({
                category: data.category,
                content: data.content,
                title: data.title,
                tags: data.tags,
                video: data.videoUrl,
                audio: data.audioUrl,
                status: data.status,
                reporterId: data.id,
                newTag: newTag,
                thumbnail: data.thumbnailUrl
              });
            }
          } else {
            // create new draft
            apiUrl = API_LIST.DRAFT_ARTICLE;
            const res = await axios.post(API_LIST.BASE_URL + apiUrl, formData, {
              headers: {
                Authorization: `Bearer ${token}`, // attach JWT
              },
            });
            if (res.data) {
              const data = res.data;
              setFormData({
                category: data.category,
                content: data.content,
                title: data.title,
                tags: data.tags,
                video: data.videoUrl,
                audio: data.audioUrl,
                status: data.status,
                reporterId: data.id,
                newTag: newTag,
                thumbnail: data.thumbnailUrl
              });
            }
          }
        } else if (actionName.toLowerCase() === "save") {
          apiUrl = API_LIST.SUBMIT_ARTICLE;
          await axios.post(API_LIST.BASE_URL + apiUrl, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        console.log("✅ Success:", formData);
      } catch (err) {
        console.error("❌ Error:", err);
      }
    }
  };

  useEffect(() => {
    setFormData(getInitialState());
    setNewTag("");  // also reset tag input
    setErrors({});
  }, [path]);

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
          <form id="myForm" onSubmit={(e) => {
            const action = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
              submitForReview(e, action?.name);
          }} >
          <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-2xl shadow-md">
            <div className="flex items-center justify-between pt-[8px] pb-[32px]">
              <h2 className="text-lg font-medium">Content Editor</h2>
              <div className="flex gap-[12px]"> 
                {formData.status.toLowerCase() == 'draft' && <span className="px-[12px] py-[4px] text-sm text-[#6A7282] rounded-lg bg-[#F8FAF9] border-1 border-[#E5E7EB]">Draft</span>}
                {formData.status.toLowerCase() == 'submitted' && <span className="px-[12px] py-[4px] text-sm text-[#006601] rounded-lg bg-[#f8faf9] border-1 border-[#B3E6B3]">Auto-saved</span>}
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
                    variant={
                      formData.category === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleChange({category:category}, false)}
                    className={`px-[24px] py-[6px] ${
                      formData.category === category
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
                  name="title"
                  placeholder="Name"
                  value={formData.title}
                  onChange={handleChange}
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
                    selectedValue={formData.content}
                    placeholder="Write something..."
                    onChange={(json) => handleChange({content:json}, false)}
                  />
              </div>
            </>)}

              {/** Audio */}
              {path === "audio" && ( <>
                {!formData.audio && <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] flex items-center justify-center">
                    <Mic className="h-6 w-6" />
                  </div>
                  <p className="mt-6 font-medium">Upload audio file</p>
                  <p className="text-sm text-gray-500 mt-1">Supports MP3, WAV, M4A (Max 100MB)</p>
                  <label className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-xl cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Choose File</span>
                    <input type="file" accept=".mp3,.wav,.m4a" hidden 
                    onChange={(e)=>handleChange({audio: e.target.files?.[0]}, false)}/>
                  </label>
                  {/* {audioFile && <p className="mt-3 text-sm text-gray-700">Selected: {audioFile.name}</p>} */}
                </div>}
                {formData.audio && 
                  <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl text-center">
                    <AudioPlayer src={formData.audio} fileName={formData.audio?.['fileName']} />
                  </div>
                }
                </>
              )}
              
                {/**Video */}
                {path === "video" && ( <>
                  {!formData.video &&<div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 text-[#9f2e00] flex items-center justify-center">
                      <Video className="h-6 w-6" />
                    </div>
                    <p className="mt-6 font-medium">Upload video</p>
                    <p className="text-sm text-gray-500 mt-1">Drag & drop your video file or click to browse</p>
                    <p className="text-sm text-gray-500">Supports MP4, MOV, AVI (Max 500MB)</p>
                    <label className="inline-flex items-center gap-2 mt-6 bg-orange-700 text-white px-4 py-2 rounded-xl cursor-pointer">
                      <Upload className="h-4 w-4" />
                      <span>Choose File</span>
                      <input type="file" accept=".mp4,.mov,.avi" hidden onChange={(e)=>handleChange({video: e.target.files?.[0]}, false)}/>
                    </label>
                    {/* {videoFile && <p className="mt-3 text-sm text-gray-700">Selected: {videoFile.name}</p>} */}
                  </div>}
                  {formData.video && 
                  <VideoPlayer src={formData.video}  onThumbnailGenerated={(thumbnail)=>{
                      handleChange({thumbnail: thumbnail}, false)
                  }}
                  onDelete={()=>{
                    formData.video= null;
                    formData.thumbnail= '';
                  }}/>
                  }
                </>)}

                {path === "video" && ( <>      
              <div>
                <label className="block text-sm font-medium">Thumbnail Preview</label>
                <div className="mt-2 h-28 w-full bg-gray-100 rounded-xl">
                {formData.thumbnail && (
                    <img
                      src={formData.thumbnail}
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
                          placeholder="Add tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
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
                      {formData.tags.map((tag, index) => (
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
          </form>
        </div>
      </header>
    </div>
  );
};

export default ContentUploader;
