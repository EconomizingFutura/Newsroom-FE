import CustomQuilTextEditor from "@/components/ui/CustomQuilTextEditor";
import { InputLabel } from "@/components/ui/form";
import InfoBadge from "@/components/ui/InfoBatch";
import { Input } from "@/components/ui/input";
import type { contentResponse } from "@/types/apitypes";
import { formatToIST } from "@/utils/utils";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

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
          <InputLabel label={"Text"} required />
          <Input
            // disabled={isPreviewMode}
            // {...register("name")}
            value={content?.title || ""}
            placeholder="Name"
            className="bg-[#f7fbf8] h-10 border-[#ECECEC] border"
          />
        </div>
      )}
      {readOnly && (
        <div>
          <h1 className="text-[#101828] font-bold text-2xl">
            {content?.title || ""}
          </h1>
          <div className="flex items-center my-2 gap-1 ">
            <InfoBadge type="date" value={formatToIST(content?.updatedAt)} />
            <InfoBadge type="user" value={content?.reporter.username} />
          </div>
        </div>
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
                className="!min-h-[220px] max-h-[500px] "
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
