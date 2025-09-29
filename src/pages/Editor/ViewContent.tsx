/* eslint-disable react-hooks/exhaustive-deps */
import ContentHeader from "@/components/ContentHeader";
import type { contentResponse } from "@/types/apitypes";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import Text from "./contents/Text";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import SuccessUI from "@/components/SuccessUI";
import RemarksModal from "@/components/RemarksModal";
import Loading from "../Shared/agency-feeds/loading";
import { useEditorReviewArticle } from "@/hooks/useEditorReviewArticle";

interface ContentForm {
  content: string;
  title: string;
  category: string;
  tags: string[];
  newTag: string;
}

const ViewContent: React.FC = () => {
  const [enableEdit, setEnableEdit] = useState<boolean>(false);
  const [contentData, setContentData] = useState<contentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState({
    success: false,
    remarks: false,
    id: "",
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, isLoading, revertArticle } = useEditorReviewArticle();

  const methods = useForm<ContentForm>({
    mode: "onChange",
    defaultValues: {
      content: "",
      title: "",
      category: "",
      tags: [],
      newTag: "",
    },
  });

  const { register, control, setValue, getValues, reset } = methods;

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const data = await getArticleById(id);
        setContentData(data ?? null);

        // Update form values with API data
        if (data) {
          reset({
            content: data.content || "",
            title: data.title || "",
            category: data.category || "",
            tags: data.tags || [],
            newTag: "",
          });
        }
      } else {
        setContentData(null);
      }
      setLoading(isLoading);
    };
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

  const onSubmit = (data: ContentForm) => {
    console.log("Form submitted:", data);
    setEnableEdit(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

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
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 font-openSans py-16 h-screen bg-background">
      <div
        style={{ paddingTop: "32px" }}
        className="flex flex-col  px-[24px] bg-[#F6FAF6] h-full"
      >
        <ContentHeader
          text="Content Review"
          onClickBack={handleBack}
          showBackButton
          showEdit={enableEdit}
          handleEdit={handleEditToggle}
        />

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex-1 flex flex-col p-5 bg-[#FFFFFF] shadow-[0px_2px_10px_0px_#959DA533]"
          >
            {contentData?.type === "TEXT" && (
              <Text
                content={contentData}
                enableEdit={enableEdit}
                readOnly={!enableEdit}
              />
            )}

            {contentData?.type === "VIDEO" && (
              <div className="flex-1 flex flex-col p-8 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Video Content</h3>
                {contentData.videoUrl ? (
                  <video
                    controls
                    className="w-full max-w-2xl mx-auto rounded-lg"
                  >
                    <source src={contentData.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🎬</div>
                    <p>No video content available</p>
                  </div>
                )}
              </div>
            )}

            {contentData?.type === "AUDIO" && (
              <div className="flex-1 flex flex-col p-8 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-4">Audio Content</h3>
                {contentData.audioUrl ? (
                  <audio controls className="w-full max-w-2xl mx-auto">
                    <source src={contentData.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                  </audio>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🎵</div>
                    <p>No audio content available</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3 mt-6">
              {enableEdit && (
                <>
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
                      className="py-[19px] border-[#ECECEC] bg-[#f7fbf8]"
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
          </form>
        </FormProvider>
      </div>
      {enableEdit ? (
        <div className="flex justify-end gap-4 mx-6 mt-4">
          <Button
            type="button"
            variant="outline"
            className="text-[14px] w-28 font-semibold"
            onClick={() => setEnableEdit(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#006601] text-[14px] w-28 font-semibold hover:bg-[#005001]"
          >
            Update
          </Button>
        </div>
      ) : (
        <div className="flex justify-end gap-4 mx-6 mt-4">
          <Button
            variant="outline"
            onClick={toggleRemarks}
            className="text-white bg-[#FB2C36] hover:text-white hover:bg-[#FB2C36] border-red-300 "
          >
            Reverted
          </Button>
          <Button
            onClick={() => contentData && handleMoveToPublish(contentData?.id)}
            className="bg-[#008001] font-semibold hover:bg-[#008001] text-white"
          >
            Approve & Move to publish{" "}
          </Button>
        </div>
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
    </div>
  );
};

export default ViewContent;
