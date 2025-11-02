import EditorRemarks from "@/components/EditorRemarks";
import { Badge } from "@/components/ui/badge";
import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import { InputLabel } from "@/components/ui/form";
import InfoBadge from "@/components/ui/InfoBatch";
import { Input } from "@/components/ui/input";
import { historyStatus, type contentResponse } from "@/types/apitypes";
import type { currentPageType } from "@/types/sidebarTypes";
import { formatToIST } from "@/utils/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSearchParams } from "react-router";

interface TextProps {
  content: contentResponse;
  readOnly?: boolean;
  enableEdit?: boolean;
}

const Text: React.FC<TextProps> = ({
  content,
  readOnly = false,
  enableEdit = false,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [searchParams] = useSearchParams();

  const from = searchParams.get("from") as
    | currentPageType
    | null
    | "publishCenter";

  // const validateContent = (value: string): boolean | string => {
  //   if (!value || value.trim() === "" || value.trim() === "<p><br></p>") {
  //     return "Content is required";
  //   }

  //   const textContent = value.replace(/<[^>]*>/g, "").trim();
  //   if (textContent.length < 10) {
  //     return "Content should be at least 10 characters long";
  //   }

  //   if (textContent.length > 50000) {
  //     return "Content should not exceed 50000 characters";
  //   }

  //   return true;
  // };

  return (
    <div className="flex-1 flex flex-col">
      {!readOnly && (
        <div className="space-y-2">
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <div className="space-y-2">
                <InputLabel label={"Text"} required />
                <Input
                  {...field}
                  placeholder="Title"
                  className="bg-[#f7fbf8] h-10 border-[#ECECEC] border"
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
      )}
      {readOnly && (
        <div className="flex justify-between gap-4 px-4">
          <div>
            <h1 className="text-[#101828] font-bold text-2xl">
              {content?.title || ""}
            </h1>
            <div className="flex items-center my-2 gap-1 ">
              <InfoBadge type="date" value={formatToIST(content?.updatedAt)} />
              <InfoBadge type="user" value={content?.reporter.username} />
            </div>
          </div>
          {from == "editor-history" && (
            <Badge
              className={`px-2 py-1 max-h-8 flex justify-center items-center ${historyStatus(
                content.status
              )}`}
            >
              <span className="!font-semibold text-[14px]">
                {content.status}
              </span>
            </Badge>
          )}
        </div>
      )}

      {content?.remarks && from == "editor-history" && (
        <EditorRemarks remarks={content?.remarks} />
      )}

      <>
        {!readOnly && <InputLabel label={"Content"} required />}

        <Controller
          name="content"
          control={control}
          rules={{
            required: "Content is required",
            // validate: validateContent,
          }}
          defaultValue={content?.content || ""}
          render={({ field }) => (
            <>
              <CustomQuilTextEditor
                selectedValue={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                placeholder="Write something..."
                readOnly={readOnly || !enableEdit}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <span>⚠</span>
                  {errors.content.message as string}
                </p>
              )}
            </>
          )}
        />
      </>
    </div>
  );
};

export default Text;
