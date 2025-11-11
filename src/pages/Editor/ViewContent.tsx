/* eslint-disable react-hooks/exhaustive-deps */
import ContentHeader from "@/components/ContentHeader";
import { historyStatus, type contentResponse } from "@/types/apitypes";
import React, { useState, useEffect, useRef } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
import Text from "./contents/Text";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Mic, Upload, Trash } from "lucide-react";
import SuccessUI from "@/components/SuccessUI";
import RemarksModal from "@/components/RemarksModal";
import Loading from "../Shared/agency-feeds/loading";
import { useEditorReviewArticle } from "@/hooks/useEditorReviewArticle";
import VideoUrlPlayer, {
  AudioUrlPlayer,
} from "../Reporter/ArticleCreation/Components";
import InfoBadge from "@/components/ui/InfoBatch";
import { formatToIST } from "@/utils/utils";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { useCancelEvent } from "@/hooks/useCalendarAPI";
import type { CurrentPageType } from "@/hooks/useCurrentView";
import AudioPlayer from "@/components/ui/AudioPlayer";
import ScheduleArticle from "@/components/ScheduleArticle";
import SaveDraftsUI from "@/components/SaveDraftUI";
import { SocialMediaPublishCard } from "@/components/TextEditor/SocialMediaPublishCard";
import { PATCH, POST, PUT } from "@/api/apiMethods";
import { API_LIST } from "@/api/endpoints";
import { InputLabel } from "@/components/ui/form";
import { toast, Toaster } from "sonner";
import type { AxiosError } from "axios";
import EditorRemarks from "@/components/EditorRemarks";
import { cn } from "@/components/ui/utils";
import { transformPlatformsToScheduledPosts } from "../Reporter/utils";

interface ContentForm {
  content: string;
  title: string;
  category: string;
  tags: string[];
  newTag: string;
  audio: string | File | null;
  video: string | File | null;
  thumbnail: string;
}

const ViewContent: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from") as
    | CurrentPageType
    | null
    | "publishCenter";
  const state = location.state as {
    articletype?: string;
    editable?: boolean;
  } | null;
  const isEDit = from == "publishCenter" || false;
  const [enableEdit, setEnableEdit] = useState<boolean>(isEDit);
  const [showEnableEdit, setShowEnableEdit] = useState<boolean>(
    isEDit ? false : state?.editable || false
  );
  const [contentData, setContentData] = useState<contentResponse | null>(null);
  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [saveDraftPopup, setSaveDraftPopup] = useState(false);
  const [cancelPlatforms, setCancelPlatforms] = useState<string[]>([]);
  const [show, setShow] = useState({
    success: false,
    remarks: false,
    id: "",
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, isLoading, revertArticle } = useEditorReviewArticle();
  const { handleCancelAPI } = useCancelEvent();
  const [showPublishCard, setShowPublishCard] = useState(false);
  const publishCardRef = useRef<HTMLDivElement>(null);
  const publishButtonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const methods = useForm<ContentForm>({
    mode: "onChange",
    defaultValues: {
      content: "",
      title: "",
      category: "",
      tags: [],
      newTag: "",
      audio: null,
      video: null,
      thumbnail: "",
    },
  });

  const {
    register,
    control,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isDirty },
  } = methods;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        publishCardRef.current &&
        !publishCardRef.current.contains(event.target as Node) &&
        publishButtonRef.current &&
        !publishButtonRef.current.contains(event.target as Node)
      ) {
        setShowPublishCard(false);
      }
    };

    if (showPublishCard) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPublishCard]);
  const fetch = async () => {
    if (id) {
      const data = await getArticleById(id);
      setContentData(data ?? null);
      if (data) {
        reset({
          content: data.content || "",
          title: data.title || "",
          category: data.category || "",
          tags: data.tags || [],
          newTag: "",
          audio: data.audioUrl || null,
          video: data.videoUrl || null,
        });
      }
    } else {
      setContentData(null);
    }
    setLoading(isLoading);
  };

  useEffect(() => {
    fetch();
  }, [id, reset]);

  const handleAddTag = () => {
    const newTag = getValues("newTag").trim();
    if (newTag) {
      const currentTags = getValues("tags");
      if (!currentTags.includes(newTag)) {
        setValue("tags", [...currentTags, newTag]);
        setValue("newTag", "");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = getValues("tags");
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (data: ContentForm) => {
    const currentValues = methods.getValues();
    const defaultValues = methods.formState.defaultValues;

    const hasChanges = Object.keys(currentValues).some((key) => {
      const cur = currentValues[key as keyof ContentForm];
      const def = defaultValues?.[key as keyof ContentForm];
      if (Array.isArray(cur) && Array.isArray(def)) {
        return JSON.stringify(cur) !== JSON.stringify(def);
      }
      if (cur instanceof File || def instanceof File) {
        return cur !== def;
      }
      return cur !== def;
    });

    if (!hasChanges) {
      toast.warning("No changes detected", {
        description: "You haven’t modified any fields.",
      });
      return;
    }
    setLoading(true);
    const URL = API_LIST.BASE_URL + API_LIST.EDITOR_EDIT_ARTICLE + id;
    await PATCH(URL, data);
    await fetch();

    setLoading(false);

    if (!isEDit) {
      handleBack();
      setShowEnableEdit((p) => !p);
      setEnableEdit((p) => !p);
    }
  };

  // const handleEdit = async();

  const handleMoveToPublish = async (id: string | number) => {
    console.log("Move to publish content with ID:", id);
    setShow((prev) => ({ ...prev, success: !prev.success }));
    if (contentData?.id) {
      await revertArticle(contentData.id.toString(), "REVIEWED", " ");
    }
    setTimeout(() => {
      handleBack();
    }, 3000);
  };

  const toggleSuccess = () => {
    setShow((prev) => ({ ...prev, success: !prev.success }));
  };

  const toggleRemarks = () => {
    setShow((prev) => ({ ...prev, remarks: !prev.remarks }));
  };

  const handleRevert = async (remarks: string) => {
    console.log("Revert content with ID:", remarks);
    setShow((prev) => ({ ...prev, remarks: !prev.remarks }));
    if (contentData?.id) {
      await revertArticle(contentData.id.toString(), "REVERTED", remarks);
    }
    handleBack();
  };

  const handleEditToggle = () => {
    setEnableEdit((prev) => !prev);
    setShowEnableEdit((prev) => !prev);
  };

  if (loading) {
    return <Loading />;
  }

  // const handleScheduleFromEditor = () => {
  //   console.log("coming inside muthu");
  //   setScheduleModalOpen((p) => !p);
  // };

  const handleAPI = async () => {
    handleCancelAPI(id as string, cancelPlatforms);
    setShowEditPopup((prev) => !prev);
    handleBack();
  };

  const audioVal = watch("audio");

  const handlePublishNowClick = () => {
    setShowPublishCard(!showPublishCard);
  };

  const handlePublishCardClose = () => {
    setShowPublishCard(false);
  };

  const handlePublish = async (
    platforms: { platformName: string; date: string; time: string }[],
    isEdit: boolean
  ) => {
    const controller = new AbortController();
    const payloadData = transformPlatformsToScheduledPosts(platforms);
    try {
      setLoading(true);
      const payload = {
        id: contentData?.id,
        scheduledPosts: payloadData,
      };
      const url = API_LIST.BASE_URL + API_LIST.SCHEDULED_POST;
      if (isEdit) {
        const payloadData = payload.scheduledPosts.filter((a) => !a.isPosted);
        const sppayload = {
          id: contentData?.id,
          scheduledPosts: payloadData,
        };
        const data = await PUT(url, sppayload, { signal: controller.signal });
        console.log(data, "put");
      } else {
        await POST(url, payload, { signal: controller.signal });
      }
      console.log("Story scheduled successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.name === "AbortError") {
        console.warn("Request aborted");
      } else {
        console.error("Error scheduling story:", error);
      }
    } finally {
      setLoading(false);
      handleBack();
    }
  };

  const handlePublishNow = async (storyId: string, platforms: string[]) => {
    const controller = new AbortController();
    const now = new Date();
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const formatTime = (d: Date) => {
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    const newPayload = platforms
      .map((platform) => ({
        platform: platform.toLowerCase(),
        date: formatDate(now),
        time: formatTime(now),
        isPosted: false,
      }))
      .filter((a) => a.platform.toLowerCase() !== "all");

    try {
      setLoading(true);

      const url = API_LIST.BASE_URL + API_LIST.SCHEDULED_POST;

      await POST(
        url,
        {
          id: storyId,
          scheduledPosts: newPayload,
        },
        { signal: controller.signal }
      );

      console.log("Story published successfully!");
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.name === "AbortError") {
        console.warn("Request aborted");
      } else {
        console.error("Error scheduling story:", error);
      }
    } finally {
      setLoading(false);
      handleBack();
    }
  };

  const handlePublishCardPublish = (selectedPlatforms: string[]) => {
    if (id) {
      handlePublishNow(id, selectedPlatforms);
    }
    console.log("Publishing to platforms:", selectedPlatforms);
    setShowPublishCard(false);
  };

  const handleCancel = () => {
    setShowEnableEdit((p) => !p);
    setEnableEdit((p) => !p);
    reset(getValues());
  };

  const ISPOSTED = contentData?.status !== "POSTED";

  return (
    <div className="flex-1 font-openSans py-8 min-h-screen bg-[#f2f6f2] overflow-auto">
      <Toaster position="top-center" richColors />
      <div className="flex flex-col flex-1 min-h-96 px-6   pt-16 overflow-y-auto">
        <ContentHeader
          text="Content Review"
          onClickBack={handleBack}
          showBackButton
          story={contentData}
          showEdit={contentData?.status == "POSTED" ? false : showEnableEdit}
          handleEdit={handleEditToggle}
          handleCancel={(id, platforms) => {
            console.log(id);
            setCancelPlatforms(platforms || []);
          }}
          showCancelSchedule={
            contentData?.status == "POSTED" ? false : showEnableEdit
          }
          handleEditPopup={() => setShowEditPopup((p) => !p)}
        />

        <FormProvider {...methods}>
          <form
            ref={formRef}
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col bg-white mt-2 shadow-[0px_2px_10px_0px_#959DA533] space-y-6"
          >
            <div className="flex flex-col px-6 space-y-6 p-4 sm:p-6 mb-2">
              {contentData?.type === "TEXT" && (
                <Text
                  content={contentData}
                  enableEdit={enableEdit}
                  readOnly={!enableEdit}
                />
              )}

              {contentData?.type === "VIDEO" && (
                <>
                  <div>
                    {!enableEdit ? (
                      <div className="space-y-2 my-2">
                        <Controller
                          name="title"
                          control={control}
                          rules={{ required: "Title is required" }}
                          render={({ field }) => (
                            <div className="space-y-2">
                              <InputLabel label="Title" required />
                              <Input
                                {...field}
                                placeholder="Enter title"
                                className="bg-[#f7fbf8] h-10 border-[#ECECEC] border"
                                disabled={!enableEdit}
                              />

                              {errors.title && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.title.message as string}
                                </p>
                              )}
                            </div>
                          )}
                        />
                      </div>
                    ) : (
                      <div className=" flex justify-between items-center">
                        <div>
                          <h1 className="text-[#101828] font-bold text-2xl">
                            {contentData?.title || ""}
                          </h1>
                          <div className="flex items-center my-2 gap-3 ">
                            <InfoBadge
                              type="date"
                              value={formatToIST(contentData?.updatedAt)}
                            />
                            <InfoBadge
                              type="user"
                              value={contentData?.reporter.username}
                            />
                          </div>
                        </div>

                        {from == "editor-history" && (
                          <div>
                            <Badge
                              className={`px-2 py-1 max-h-8 flex justify-center items-center ${historyStatus(
                                contentData.status
                              )}`}
                            >
                              <span className=" text-[14px]">
                                {contentData.status}
                              </span>
                            </Badge>
                          </div>
                        )}
                        {contentData?.remarks && from == "editor-history" && (
                          <EditorRemarks remarks={contentData?.remarks} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* ✅ Upload box (no video yet) */}
                  {(!watch("video") || watch("video") === null) && (
                    <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center bg-[#FAFFFA]">
                      <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] flex items-center justify-center">
                        🎬
                      </div>

                      <p className="mt-6 font-medium">Upload video file</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports MP4, MOV, AVI (Max 500MB)
                      </p>

                      <label
                        htmlFor="video-upload"
                        className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-200 transition"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose File</span>
                      </label>

                      <input
                        id="video-upload"
                        type="file"
                        accept="video/mp4,video/mov,video/avi"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setValue("video", file, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />

                      {methods.formState.errors.video && (
                        <p className="text-sm text-red-500 mt-2">
                          {methods.formState.errors.video.message as string}
                        </p>
                      )}
                    </div>
                  )}

                  {/* ✅ If video exists */}
                  {watch("video") && (
                    <div className="border-2 w-full border-dashed border-[#B2E6B3] rounded-2xl text-end">
                      {enableEdit && (
                        <button
                          type="button"
                          onClick={() =>
                            setValue("video", null, { shouldDirty: true })
                          }
                          className="bg-red-400 flex items-center gap-2 ml-auto mx-8 my-4 w-min text-white text-sm px-3 py-1 rounded-lg shadow hover:bg-red-500 transition"
                        >
                          <Trash size={12} /> Remove
                        </button>
                      )}

                      {typeof watch("video") === "string" ? (
                        // ✅ From API
                        <div className="py-2 w-full flex flex-col">
                          {contentData?.remarks && from == "editor-history" && (
                            <EditorRemarks remarks={contentData?.remarks} />
                          )}
                          <VideoUrlPlayer
                            videoUrl={watch("video") as string}
                            thumbnailUrl={
                              contentData?.thumbnailUrl as string | undefined
                            }
                          />
                        </div>
                      ) : (
                        // ✅ From local upload
                        <div className="p-4 flex justify-center">
                          <video
                            src={URL.createObjectURL(watch("video") as File)}
                            controls
                            className="w-full max-w-3xl rounded-lg shadow"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {contentData?.type === "AUDIO" && (
                <>
                  {enableEdit ? (
                    <div className="space-y-2">
                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: "Title is required" }}
                        render={({ field }) => (
                          <>
                            <InputLabel label="Title" required />
                            <Input
                              {...field}
                              placeholder="Enter title"
                              className="bg-[#f7fbf8] h-10 border-[#ECECEC] border"
                            />
                            {errors.title && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.title.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  ) : (
                    <div className=" flex justify-between items-center">
                      <div className="flex flex-col gap-3">
                        <h1 className="text-[#101828] font-bold text-2xl">
                          {contentData?.title || ""}
                        </h1>
                        <div className="flex items-center mb-2 gap-3 ">
                          <InfoBadge
                            type="date"
                            value={formatToIST(contentData?.updatedAt)}
                          />
                          <InfoBadge
                            type="user"
                            value={contentData?.reporter.username}
                          />
                        </div>
                      </div>

                      {ISPOSTED && (
                        <div>
                          <Badge
                            className={`px-2 py-1 max-h-8 flex justify-center items-center ${historyStatus(
                              contentData.status
                            )}`}
                          >
                            <span className=" text-[14px]">
                              {contentData.status}
                            </span>
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {(!audioVal || audioVal === null) && (
                    <div className="border-2 border-dashed border-[#B2E6B3] rounded-2xl p-10 text-center bg-[#FAFFFA]">
                      <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 text-[#a32fff] flex items-center justify-center">
                        <Mic className="h-6 w-6" />
                      </div>

                      <p className="mt-6 font-medium">Upload audio file</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports MP3, WAV, M4A (Max 100MB)
                      </p>

                      <label
                        htmlFor="audio-upload"
                        className="inline-flex items-center gap-2 mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-200 transition"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose File</span>
                      </label>

                      <input
                        id="audio-upload"
                        type="file"
                        accept=".mp3,.wav,.m4a"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setValue("audio", file, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />

                      {methods.formState.errors.audio && (
                        <p className="text-sm text-red-500 mt-2">
                          {methods.formState.errors.audio.message as string}
                        </p>
                      )}
                    </div>
                  )}
                  {contentData?.remarks && from == "editor-history" && (
                    <EditorRemarks remarks={contentData?.remarks} />
                  )}

                  {audioVal && (
                    <div className="border-2 w-full border-dashed border-[#B2E6B3] rounded-2xl text-end">
                      {enableEdit && (
                        <button
                          type="button"
                          onClick={() =>
                            setValue("audio", null, { shouldDirty: true })
                          }
                          className="bg-red-400 flex items-center gap-2 ml-auto mx-8 my-4 w-min text-white text-sm px-3 py-1 rounded-lg shadow hover:bg-red-500 transition"
                        >
                          <Trash size={12} /> Remove
                        </button>
                      )}

                      {typeof audioVal === "string" ? (
                        <div className="py-2 w-full flex flex-col">
                          <AudioUrlPlayer src={audioVal} />
                        </div>
                      ) : (
                        <div className="p-2">
                          <AudioPlayer
                            src={URL.createObjectURL(audioVal)}
                            fileName={audioVal?.name}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              <div className={cn("space-y-3 ")}>
                {enableEdit && (
                  <>
                    <label className="flex items-center gap-2 font-medium">
                      Tags <span className="text-red-500">*</span>
                    </label>

                    <div className="relative  w-full flex flex-col items-center rounded-[8px] h-10 sm:flex-row gap-2">
                      <Input
                        {...register("newTag")}
                        placeholder="Add tag"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className=" rounded-[8px] border-[#ECECEC] bg-[#f7fbf8] border h-10! py-1.5"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddTag}
                        className="absolute top-1 right-3 bg-[#006601] hover:bg-[#006601] font-semibold rounded-[8px] flex max-h-[28px]  text-[14px] px-4 py-1.5 gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </>
                )}

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
                            className="gap-2 px-3 py-1 text-[#008001] bg-[#f8faf9] border-[#B3E6B3]"
                          >
                            {tag}
                            {enableEdit && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className=""
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            {((!isEDit && enableEdit) ||
              (from !== "calendar" &&
                from !== "publishCenter" &&
                from !== "editor-history") ||
              isEDit) &&
              ISPOSTED && (
                <div className="shadow-[0px_2px_10px_0px_#0000001A,0px_0px_2px_0px_#00000033] border border-b-[#0000001A] bg-[#FFFFFF] h-min py-6 px-4">
                  {!isEDit && enableEdit ? (
                    <div className="flex flex-wrap justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="text-[14px] w-28 "
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#006601] text-[14px] w-28 hover:bg-[#005001]"
                        onClick={() => {
                          if (!isDirty) {
                            toast.warning("No changes detected", {
                              description: "You haven’t modified any fields.",
                            });
                            return;
                          }
                          methods.handleSubmit(onSubmit)();
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  ) : (
                    from !== "calendar" &&
                    from !== "publishCenter" &&
                    from !== "editor-history" && (
                      <div className="flex flex-wrap justify-end gap-3">
                        <Button
                          variant="outline"
                          type="button"
                          onClick={toggleRemarks}
                          className="text-[#FB2C36] bg-white hover:text-[#FB2C36] w-[120px] hover:bg-white border-[#FB2C36]"
                        >
                          Revert
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            if (contentData) {
                              handleMoveToPublish(contentData.id);
                            }
                          }}
                          className="bg-[#008001] hover:bg-[#008001] text-white"
                        >
                          Approve & Move to publish
                        </Button>
                      </div>
                    )
                  )}

                  {isEDit && (
                    <div className="flex flex-wrap justify-end gap-6">
                      <Button
                        type="submit"
                        onClick={() => {
                          formRef.current?.requestSubmit();
                        }}
                        variant="outline"
                        className="text-[14px] font-semibold py-1.5 px-4 h-10 hover:bg-white hover:text-[#006601] w-30 text-[#006601]"
                      >
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-[14px] hover:bg-white py-1.5 px-4 hover:text-[#006601] w-30 h-10  text-[#006601] font-semibold"
                        onClick={() => setScheduleModalOpen((p) => !p)}
                      >
                        {contentData?.status == "SCHEDULED"
                          ? "Re Schedule"
                          : "Schedule"}
                      </Button>
                      <Button
                        type="button"
                        onClick={handlePublishNowClick}
                        className="bg-[#006601] text-[14px] py-1.5 px-[18px] w-30 h-10 font-semibold  hover:bg-[#005001]"
                      >
                        Publish Now
                      </Button>
                    </div>
                  )}
                </div>
              )}
          </form>
        </FormProvider>
      </div>

      {scheduleModalOpen && (
        <ScheduleArticle
          onCancel={() => setScheduleModalOpen(false)}
          handlePublish={handlePublish}
          contentData={contentData}
        />
      )}

      {showPublishCard && (
        <div
          ref={publishCardRef}
          className="absolute bottom-28 right-12 mb-2 z-100!"
        >
          <SocialMediaPublishCard
            isOpen={showPublishCard}
            onClose={handlePublishCardClose}
            onPublish={handlePublishCardPublish}
          />
        </div>
      )}

      {saveDraftPopup && (
        <SaveDraftsUI
          saveType={"PUBLISHED"}
          onCancel={() => setSaveDraftPopup((p) => !p)}
        />
      )}

      {show.success && (
        <SuccessUI
          onCancel={toggleSuccess}
          label={"Article Approved and Moved to Publish Successfully!"}
        />
      )}
      {show.remarks && (
        <RemarksModal onCancel={toggleRemarks} onConfirm={handleRevert} />
      )}
      {showEditPopup && (
        <DeleteConfirmation
          onCancel={() => {
            setShowEditPopup((prev) => !prev);
          }}
          onConfirm={handleAPI}
        />
      )}
    </div>
  );
};

export default ViewContent;
