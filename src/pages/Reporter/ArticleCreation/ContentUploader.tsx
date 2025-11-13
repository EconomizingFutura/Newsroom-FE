import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Plus, Save, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIcon, type HeaderKey } from "@/utils/HeaderIcons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import { Controller, useForm } from "react-hook-form";
import { API_LIST } from "@/api/endpoints";
import { PATCH, POST } from "@/api/apiMethods";
import { useEffect, useMemo, useState } from "react";
import SaveDraftsUI from "@/components/SaveDraftUI";
import { AudioContainer, VideoContainer } from "./Components";
import { uploadToS3 } from "@/config/s3Config";
import { base64ToFile } from "@/utils/compression";
import { v4 as uuidv4 } from "uuid";
import processAndUploadImages from "../utils";
import Loading from "@/pages/Shared/agency-feeds/loading";
import { toast, Toaster } from "sonner";
import { throttle } from "lodash";

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

const ContentUploader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [submit, setSubmit] = useState<{
    type: "DRAFT" | "SUBMIT" | null;
    isSubmit: boolean;
  }>({
    type: null,
    isSubmit: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSavingToDraft, setIsSavingToDraft] = useState(false);

  const handleSubmitUI = (type: "DRAFT" | "SUBMIT") => {
    setSubmit({
      type,
      isSubmit: true,
    });
  };

  const handleCloseUI = () => {
    setSubmit({
      type: null,
      isSubmit: false,
    });
    toast.success("Article Submitted for review!");
    reset();
    // navigate("/history");
  };

  const path = location.pathname.replace("/", "");

  const tabs = [
    { id: "textArticle", name: "Text Article" },
    { id: "audio", name: "Audio Post" },
    { id: "video", name: "Video Post" },
  ];

  const headerConfig: Record<
    string,
    { label: string; color: string; icon: string }
  > = {
    textArticle: {
      label: "Create Text Article",
      color: "#2B7FFF",
      icon: "Text Article",
    },
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
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
    },
  });

  const tags = watch("tags");
  const newTag = watch("newTag");
  const audio = watch("audio");
  const video = watch("video");
  const thumbnail = watch("thumbnail");

  /** Submit Handler */
  const submitForReview = async (data: FormData, e: any) => {
    const actionName = (e?.nativeEvent as any)?.submitter?.name || "";
    let url = "";
    let articleType = "TEXT";
    let thumbnailStr = "";
    let modifiedContent = "";
    try {
      // Determine article type based on active tab (path)
      if (path === "audio" && data.audio) {
        articleType = "AUDIO";
        url = await uploadToS3(data.audio, "audio", actionName.toLowerCase());
      } else if (path === "video" && data.video) {
        articleType = "VIDEO";
        url = await uploadToS3(data.video, "video", actionName.toLowerCase());
      } else {
        articleType = "TEXT";
        modifiedContent = await processAndUploadImages(data.content);
      }

      // upload thumbnail
      if (data.thumbnail) {
        thumbnailStr = await uploadToS3(
          base64ToFile(data.thumbnail, `${uuidv4()}.png`), // ensure it's a File
          "thumbnail",
          actionName.toLowerCase()
        );
      }
      // Build API payload
      const API_DATA = {
        ...data,
        content: modifiedContent,
        type: articleType,
        audio: articleType === "AUDIO" ? url : "",
        video: articleType === "VIDEO" ? url : "",
        thumbnail: articleType === "VIDEO" ? thumbnailStr : "",
      };

      const reporterId = getValues("reporterId");

      if (actionName.toLowerCase() === "draft") {
        if (reporterId) {
          const response: any = await PATCH(
            API_LIST.BASE_URL + API_LIST.DRAFT_BY_ARTICLE + reporterId,
            { ...API_DATA, status: "DRAFT" }
          );
          if (response.id) {
            setValue("reporterId", response.id);
            //navigate("/drafts");
          }
        } else {
          const response: any = await POST(
            API_LIST.BASE_URL + API_LIST.DRAFT_ARTICLE,
            API_DATA
          );
          if (response.id) {
            setValue("reporterId", response.id);
            //navigate("/history");
          }
        }

        toast.success("Saved as draft please keep editing");

        // handleSubmitUI("DRAFT");
      } else if (actionName.toLowerCase() === "save") {
        setLoading(true);
        await POST(API_LIST.SUBMIT_ARTICLE, API_DATA);
        setLoading(false);

        handleSubmitUI("SUBMIT");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveDraft = async (createNewDraft: boolean) => {
    if (isSavingDraft && isSavingToDraft) return; // prevent duplicate calls

    const data = getValues(); // get current form values
    try {
      let url = "";
      let articleType = "TEXT";
      let modifiedContent = "";
      let thumbnailStr = "";

      // Determine article type
      if (path === "audio" && data.audio) {
        articleType = "AUDIO";
        url = await uploadToS3(data.audio, "audio", "draft");
      } else if (path === "video" && data.video) {
        articleType = "VIDEO";
        url = await uploadToS3(data.video, "video", "draft");
      } else {
        articleType = "TEXT";
        modifiedContent = await processAndUploadImages(data.content);
      }

      // Upload thumbnail if exists
      if (data.thumbnail) {
        thumbnailStr = await uploadToS3(
          base64ToFile(data.thumbnail, `${uuidv4()}.png`),
          "thumbnail",
          "draft"
        );
      }

      const API_DATA = {
        ...data,
        content: modifiedContent,
        type: articleType,
        audio: articleType === "AUDIO" ? url : "",
        video: articleType === "VIDEO" ? url : "",
        thumbnail: articleType === "VIDEO" ? thumbnailStr : "",
        status: "DRAFT",
      };

      const reporterId = data.reporterId;

      let response: any;
      if (reporterId) {
        response = await PATCH(
          API_LIST.BASE_URL + API_LIST.DRAFT_BY_ARTICLE + reporterId,
          API_DATA
        );
      } else {
        response = await POST(
          API_LIST.BASE_URL + API_LIST.DRAFT_ARTICLE,
          API_DATA
        );
      }

      if (response?.id) setValue("reporterId", response.id);

      if (createNewDraft) {
        toast.success("Saved to draft!");
        reset();
        setValue("reporterId", null);
      } else {
        toast.success("Saved as draft! You can continue editing.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving draft");
    } finally {
      setIsSavingDraft(false);
      setIsSavingToDraft(false);
    }
  };
  // wrap inside useMemo to preserve the same throttled function instance

  const throttledSaveExisting = useMemo(
    () =>
      throttle(
        () => {
          saveDraft(false);
          setIsSavingDraft(true);
        },
        5000,
        { trailing: false }
      ),
    []
  );

  const throttledSaveToDraft = useMemo(
    () =>
      throttle(
        () => {
          saveDraft(true);
          setIsSavingToDraft(true);
        },
        5000,
        { trailing: false }
      ),
    []
  );

  /** Tags */
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue("tags", [...tags, newTag.trim()]);
      setValue("newTag", "");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };
  const title = watch("title");
  const category = watch("category");
  const content = watch("content");
  const tagsList = watch("tags");

  const isFormValidForSubmit = useMemo(() => {
    if (!title?.trim() || !category) return false;

    // Tag validation
    if (!tagsList || tagsList.length === 0) return false;

    // Type-based validation
    if (
      path === "textArticle" &&
      (!content || content.trim() === "<p><br></p>")
    )
      return false;
    if (path === "audio" && !audio) return false;
    if (path === "video" && !video) return false;

    return true;
  }, [title, category, tagsList, content, audio, video, path]);

  /** Reset form when tab changes */
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
  const isValidForDraft = useMemo(() => {
    const title = watch("title");
    return Boolean(title?.trim());
  }, [watch("title")]);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#f6faf6] overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* ✅ Fixed Header (Top Bar Only) */}
      <header className="sticky top-0 z-30 bg-[#f6faf6] pt-[60px]">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="border border-[#E5E7EB] h-10 w-10 rounded-[8.5px]"
            style={{ backgroundColor: activeConfig.color }}
          >
            <HeaderIcon
              className="text-white"
              name={activeConfig.icon as HeaderKey}
            />
          </Button>

          <p className="font-bold text-2xl">{activeConfig.label}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 px-2 ml-auto">
            <Button
              form="myForm"
              type="button"
              name="draft"
              variant="outline"
              size="sm"
              disabled={!isValidForDraft || isSavingDraft || isSavingToDraft}
              className="gap-2 border-[#B3E6B3] bg-[#F0F9F0] h-10 px-4 text-[14px] text-[#008001]"
              onClick={throttledSaveExisting}
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save
                </>
              )}
            </Button>

            <Button
              form="myForm"
              type="button"
              name="draft"
              variant="outline"
              size="sm"
              disabled={!isValidForDraft || isSavingDraft || isSavingToDraft}
              className="gap-2 border-[#B3E6B3] bg-[#F0F9F0] h-10 px-4 text-[14px] text-[#008001]"
              onClick={throttledSaveToDraft}
            >
              {isSavingToDraft ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save to Draft
                </>
              )}
            </Button>

            <Button
              form="myForm"
              type="submit"
              name="save"
              size="sm"
              disabled={
                !isFormValidForSubmit || isSavingDraft || isSavingToDraft
              }
              className="bg-green-700 hover:bg-green-700 h-10 text-[14px] text-white gap-2"
            >
              <Send className="w-4 h-4" />
              Submit for Review
            </Button>
          </div>
        </div>
      </header>

      {/* ✅ Scrollable Area (Tabs + Form) */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Tabs Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-2xl shadow-md mt-4">
          <div className="flex space-x-1 bg-[#6A72821A] p-1 rounded-lg w-fit">
            {tabs.map((tab) => {
              const isActive = path === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(`/${tab.id}`)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-white font-bold text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Section */}
        <form
          id="myForm"
          className="mt-4"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
              e.preventDefault();
            }
          }}
          onSubmit={handleSubmit(submitForReview)}
        >
          <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-2xl shadow-md space-y-6">
            {/* Category */}
            <div>
              <div className="flex items-center gap-2 mb-[8px]">
                <label className="font-medium">Select Category</label>
                <span className="text-red-500">*</span>
              </div>
              <div className="flex gap-[12px] flex-wrap">
                {categories.map((category) => (
                  <Button
                    type="button"
                    key={category}
                    variant={
                      watch("category") === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setValue("category", category)}
                    className={`px-[24px] py-[6px] ${
                      watch("category") === category
                        ? " bg-[#008001] hover:bg-green-700"
                        : "bg-[#F8FAF9]"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Title"
                {...register("title", { required: "Title is required" })}
                className={`bg-[#f7fbf8] border-[#ECECEC] h-[40px] ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
            </div>

            {/* Content */}
            {path === "textArticle" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium">
                  Content <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="content"
                  rules={{
                    validate: (value) => {
                      if (
                        path === "textArticle" &&
                        (!value || value.trim() === "<p><br></p>")
                      ) {
                        return "Content is required";
                      }
                    },
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
            )}

            {/* Audio / Video */}
            {path === "audio" && (
              <AudioContainer audio={audio} setValue={setValue} />
            )}
            {path === "video" && (
              <VideoContainer
                video={video}
                setValue={setValue}
                thumbnail={thumbnail}
              />
            )}

            {/* Tags */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-medium">
                Tags <span className="text-red-500">*</span>
              </label>

              <div className="relative w-full">
                <Input
                  {...register("newTag")}
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className={`py-[19px] border-[#ECECEC] bg-[#f7fbf8] ${
                    errors.tags ? "border-red-500" : ""
                  }`}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddTag}
                  className="absolute top-[6px] right-[12px] bg-[#006601] hover:bg-[#006601] px-4 py-4 !h-8 gap-1 text-[14px]"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Controller
                  name="tags"
                  control={control}
                  rules={{
                    validate: (tags) =>
                      tags.length > 0 || "At least one tag is required",
                  }}
                  render={({ field }) => (
                    <>
                      {field.value.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-2 text-[14px] px-3 py-1 text-[#008001] bg-[#f8faf9] border-[#B3E6B3]"
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
                    </>
                  )}
                />
              </div>
            </div>
          </div>
        </form>

        {submit.isSubmit && submit.type && (
          <SaveDraftsUI saveType={submit.type} onCancel={handleCloseUI} />
        )}
      </div>
    </div>
  );
};

export default ContentUploader;
