import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Mic,
  MoveLeft,
  Plus,
  Save,
  Send,
  Trash,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderIcon, type HeaderKey } from "@/utils/HeaderIcons";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import AudioPlayer from "@/components/ui/AudioPlayer";
import EditorRemarks from "@/components/EditorRemarks";
import SaveDraftsUI from "@/components/SaveDraftUI";
import { GET, PATCH, POST } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import VideoUrlPlayer, {
  AudioUrlPlayer,
  VideoContainer,
} from "./Reporter/ArticleCreation/Components";
import { uploadToS3 } from "@/config/s3Config";
import { base64ToFile } from "@/utils/compression";
import { v4 as uuidv4 } from "uuid";
import { HISTORY_STATUS } from "@/utils/draftUtils";
import Loading from "./Shared/agency-feeds/loading";
import { toast, Toaster } from "sonner";

type ArticleFormValues = {
  category: string;
  title: string;
  content: string;
  tags: string[];
  video: File | string | null;
  audio: File | string | null;
  status: string | null;
  thumbnail?: string | File | null;
};

const EditArticle: React.FC = () => {
  const location = useLocation();
  const isPreviewMode = location.state || false;
  const navigate = useNavigate();
  const path = location.pathname.split("/")[1];
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const [submit, setSubmit] = useState<{
    type: "DRAFT" | "SUBMIT" | null;
    isSubmit: boolean;
  }>({ type: null, isSubmit: false });

  const [newTag, setNewTag] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const schema = yup.object().shape({
    category: yup.string().required("Category is required"),
    title: yup.string().required("Name is required"),
    content:
      path === "textArticle"
        ? yup.string().test("non-empty", "Content is required", (val) => {
            // allow empty string early, treat "<p><br></p>" as empty too
            if (!val) return false;
            return val.replace(/<p><br><\/p>/g, "").trim().length > 0;
          })
        : yup.string().notRequired(),
    tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
    // audio: if audio page, require audio file or a valid URL string from API
    audio:
      path === "audio"
        ? yup
            .mixed()
            .test("present", "Audio is required", (value) => {
              if (!value) return false;
              return true;
            })
            .test("is-audio", "Unsupported audio type", (value: any) => {
              if (!value) return false;
              // if server returned URL string, assume valid
              if (typeof value === "string") return true;
              // if it's a File, check MIME
              if (value instanceof File) {
                const allowed = [
                  "audio/mpeg",
                  "audio/wav",
                  "audio/ogg",
                  "audio/x-m4a",
                  "audio/mp4",
                ];
                return allowed.includes(value.type);
              }
              return false;
            })
            .test("size", "Audio exceeds max size (100MB)", (value: any) => {
              if (!value) return false;
              if (typeof value === "string") return true;
              if (value instanceof File) return value.size <= 100 * 1024 * 1024;
              return false;
            })
        : yup.mixed().notRequired(),
    video:
      path === "video"
        ? yup
            .mixed()
            .test("present", "Video is required", (value) => {
              if (!value) return false;
              return true;
            })
            .test("is-video", "Unsupported video type", (value: any) => {
              if (!value) return false;
              if (typeof value === "string") return true;
              if (value instanceof File) {
                return value.type.startsWith("video/");
              }
              return false;
            })
            .test("size", "Video exceeds max size (500MB)", (value: any) => {
              if (!value) return false;
              if (typeof value === "string") return true;
              if (value instanceof File) return value.size <= 500 * 1024 * 1024;
              return false;
            })
        : yup.mixed().notRequired(),
    status: yup.string().nullable(),
    thumbnail: yup.mixed<File | string>().nullable().notRequired(),
  });

  // useForm with typed values
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<ArticleFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      category: "Politics",
      title: "",
      content: "",
      tags: [],
      video: null,
      audio: null,
      thumbnail: null,
      status: null,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const tags = watch("tags") || [];
  const audioVal = watch("audio");
  const videoVal = watch("video");
  const thumbnailVal = watch("thumbnail");

  const handleSubmitUI = (type: "DRAFT" | "SUBMIT") => {
    setSubmit({ type, isSubmit: true });
  };
  const handleCloseUI = () => {
    setSubmit({ type: null, isSubmit: false });
  };
  const handleBack = () => {
    if (from) {
      navigate(`/${from}`);
    }
  };

  const handleRemoveAudioVal = () => {
    setValue("audio", null, { shouldDirty: true, shouldValidate: true });
  };

  useEffect(() => {
    const controller = new AbortController();

    const getDraftArticle = async () => {
      try {
        setLoading(true);
        const response: any = await GET(
          `${API_LIST.BASE_URL}${API_LIST.GET_ARTICLE}/${id}`,
          { signal: controller.signal }
        );

        if (response) {
          const mapped: ArticleFormValues = {
            category: response.category ?? "",
            title: response.title ?? "",
            content: response.content ?? "",
            tags: Array.isArray(response.tags) ? response.tags : [],
            video: response.videoUrl ?? null,
            audio: response.audioUrl ?? null,
            thumbnail: response.thumbnailUrl ?? null,
            status: response.status ?? null,
          };

          // fill form
          Object.entries(mapped).forEach(([key, value]) => {
            setValue(key as keyof ArticleFormValues, value, {
              shouldValidate: true,
              shouldDirty: false,
            });
          });

          setRemarks(response.remarks);
        }

        setLoading(false);
      } catch (error: any) {
        if (error.name !== "AbortError")
          console.error("Error fetching article:", error);

        setLoading(false);
      }
    };

    getDraftArticle();
    return () => controller.abort();
  }, [id, setValue]);

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    const current = getValues("tags") || [];
    if (!current.includes(tag)) {
      setValue("tags", [...current, tag], {
        shouldValidate: true,
        shouldDirty: true,
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const current = getValues("tags") || [];
    setValue(
      "tags",
      current.filter((t) => t !== tagToRemove),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const onSubmit = (
    data: ArticleFormValues,
    status: "SUBMIT" | "DRAFT" | "REVERTED"
  ) => {
    submitForReview(data, status);
  };

  const submitForReview = async (
    data: ArticleFormValues,
    status: "SUBMIT" | "DRAFT" | "REVERTED"
  ) => {
    if (status === "DRAFT" || status === "REVERTED") {
      const changedKeys = Object.keys(
        dirtyFields
      ) as (keyof ArticleFormValues)[];
      if (changedKeys.length === 0) {
        return;
      }

      const changes: Partial<ArticleFormValues> = {};

      for (const key of changedKeys) {
        const value = data[key];
        if (value !== null && value !== undefined) {
          changes[key] = value as any; // 👈 cast so TS accepts it
        }
      }

      // Handle file uploads only if changed
      if (dirtyFields.audio && data.audio instanceof File) {
        changes.audio = await uploadToS3(data.audio, "audio", "draft");
      }
      if (dirtyFields.video && data.video instanceof File) {
        changes.video = await uploadToS3(data.video, "video", "draft");
      }
      if (
        dirtyFields.thumbnail &&
        data.thumbnail &&
        typeof data.thumbnail === "string"
      ) {
        changes.thumbnail = await uploadToS3(
          base64ToFile(data.thumbnail as string, `${uuidv4()}.png`),
          "thumbnail",
          "draft"
        );
      }

      changes.status = "DRAFT";
      await PATCH(
        `${API_LIST.BASE_URL}${API_LIST.DRAFT_BY_ARTICLE}${id}`,
        changes
      );
      toast.success("Saved as draft please keep editing");

      // navigate("/drafts");
    } else if (status === "SUBMIT") {
      setLoading(true);

      const API_DATA = {
        ...data,
        articleId: id,
        status: "SUBMITTED",
      };

      await POST(API_LIST.SUBMIT_ARTICLE, API_DATA);
      setLoading(false);
      // handleSubmitUI("SUBMIT");
      navigate("/history");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-[#f6faf6]">
      {/* Header */}
      <Toaster position="top-center" richColors />

      <header className="sticky top-0 z-10 bg-[#f6faf6]  pt-[60px]">
        <div className="px-4 py-3 flex flex-col gap-[24px]">
          <div className="flex flex-row items-center gap-4">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="border border-[#E5E7EB] h-10 w-10  bg-[#F8FAF9] text-[#2C3E50] rounded-[8.5px]"
              type="button"
            >
              <MoveLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border border-[#E5E7EB] h-10 w-10 rounded-[8.5px]"
              style={{ backgroundColor: activeConfig.color }}
              type="button"
            >
              <HeaderIcon className="text-white" name="Text Article" />
            </Button>
            <p className="font-bold text-2xl">{activeConfig.label}</p>
            {!isPreviewMode && (
              <div className="flex items-center gap-2 px-2 ml-auto">
                <Button
                  form="myForm"
                  type="button"
                  onClick={handleSubmit((data) => {
                    // save draft -> update status and show UI
                    // setValue("status", "DRAFT");
                    onSubmit(data, getValues("status"));
                  })}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-[#B3E6B3] bg-[#F0F9F0] text-[#008001] hover:bg-[#F0F9F0] hover:text-[#008001]"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </Button>
                <Button
                  form="myForm"
                  type="button"
                  onClick={handleSubmit((data) => {
                    // setValue("status", "SUBMIT");
                    onSubmit(data, "SUBMIT");
                  })}
                  size="sm"
                  className="bg-green-700 hover:bg-green-700 text-white gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit for Review
                </Button>
              </div>
            )}
          </div>

          <form id="myForm">
            <div className="bg-white  border-gray-200 px-8 py-6  shadow-md">
              <div className="flex items-center py-2 justify-between ">
                <h2 className="text-[20px] font-semibold">Content Editor</h2>
                <div className="flex gap-2">
                  {/* <StatusBadge
                    label={getValues("status") || ''}
                    active={getValues("status") === "DRAFT"}
                    activeClass="text-[#6A7282] bg-[#F8FAF9] border-[#E5E7EB]"
                    inactiveClass="text-[#6A7282] opacity-50 border border-transparent"
                  /> */}

                  <Badge
                    className={`px-[16px] font-semibold py-[6px] text-[14px] ${HISTORY_STATUS(
                      getValues("status") || ""
                    )}`}
                  >
                    <span>{getValues("status")}</span>
                  </Badge>
                </div>
              </div>

              {getValues("status") === "REVERTED" && (
                <EditorRemarks remarks={remarks} />
              )}

              <div className="flex flex-col gap-[24px]">
                {/* Title */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="font-medium">Title</label>
                    <span>*</span>
                  </div>
                  <Input
                    disabled={isPreviewMode}
                    {...register("title")}
                    placeholder="title"
                    className="bg-[#f7fbf8] border-[#ECECEC] border"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Content Editor */}
                {path === "textArticle" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-600 font-medium">Content</label>
                      <span className="text-600">*</span>
                    </div>

                    <Controller
                      control={control}
                      name="content"
                      render={({ field }) => (
                        <CustomQuilTextEditor
                          readOnly={isPreviewMode}
                          selectedValue={field.value}
                          placeholder="Write something..."
                          onChange={(val: string) => {
                            setValue("content", val, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            field.onChange(val);
                          }}
                        />
                      )}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500">
                        {errors.content.message as string}
                      </p>
                    )}
                  </div>
                )}

                {/* Audio */}
                {path === "audio" && (
                  <>
                    {!audioVal && (
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
                            disabled={isPreviewMode}
                            type="file"
                            accept=".mp3,.wav,.m4a"
                            hidden
                            onChange={(e) => {
                              setValue("audio", e.target.files?.[0] || null, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                          />
                        </label>
                        {errors.audio && (
                          <p className="text-sm text-red-500">
                            {errors.audio.message as string}
                          </p>
                        )}
                      </div>
                    )}

                    {audioVal && (
                      <div className="border-2 w-full  border-dashed border-[#B2E6B3] rounded-2xl text-end">
                        <button
                          type="button"
                          onClick={handleRemoveAudioVal}
                          className="  bg-red-400 flex items-center gap-2 ml-auto mx-8 my-4 w-min text-white text-sm px-3 py-1 rounded-lg shadow"
                        >
                          <Trash size={12} /> Remove
                        </button>

                        {typeof audioVal === "string" ? (
                          <div className="py-2 w-full flex flex-col">
                            <div>
                              <AudioUrlPlayer src={audioVal} />
                            </div>
                          </div>
                        ) : (
                          <div className="p-2 ">
                            <AudioPlayer
                              src={audioVal}
                              fileName={audioVal.name}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Video */}
                {path === "video" && (
                  <>
                    {typeof videoVal === "string" && videoVal ? (
                      // ✅ Video URL from API
                      <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl  p-3 text-center">
                        <VideoUrlPlayer
                          videoUrl={videoVal}
                          thumbnailUrl={thumbnailVal as string | undefined}
                          onDelete={() => {
                            // reset values when removed
                            setValue("video", null, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setValue("thumbnail", null, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                        />
                      </div>
                    ) : (
                      // ✅ File upload or empty → show container
                      <VideoContainer
                        video={videoVal as File | null}
                        thumbnail={thumbnailVal as string | undefined}
                        setValue={setValue}
                      />
                    )}
                    {errors.video && (
                      <p className="text-sm text-red-500">
                        {errors.video.message as string}
                      </p>
                    )}
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
                        disabled={isPreviewMode}
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !isPreviewMode) {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="py-[19px] border-[#ECECEC] border bg-[#f7fbf8]"
                      />
                      {!isPreviewMode && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddTag}
                          className="absolute top-[6px] right-[12px] bg-[#006601] hover:bg-[#006601] px-[16px] py-[6px] gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="gap-2 px-3 py-1 text-[#008001] bg-[#f8faf9] border-[#B3E6B3]"
                      >
                        {tag}
                        {!isPreviewMode && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>

                  {errors.tags && (
                    <p className="text-sm text-red-500">
                      {errors.tags.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {submit.isSubmit && submit.type && (
          <SaveDraftsUI saveType={submit.type} onCancel={handleCloseUI} />
        )}
      </header>
    </div>
  );
};

export default EditArticle;
