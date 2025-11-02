import { Clock, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useRef, useEffect } from "react";

import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { DatePickerComponent, PlatformIcon } from "@/utils/calendarUtils";
import type { contentResponse } from "@/types/apitypes";
import { Toaster, toast } from "sonner";

interface ScheduleArticleProps {
  onCancel: () => void;
  handlePublish: (
    platforms: string[],
    time: string,
    date: string,
    isEdit: boolean
  ) => void;
  contentData?: contentResponse | null;
}

interface PublishForm {
  type: string[];
  date?: Date;
  time: string;
  primaryPlatform: string;
  additionalPlatforms: string[];
}

const CONTENT_TABS = Object.freeze([
  { name: "All Platform" },
  { name: "Web" },
  { name: "Instagram" },
  { name: "Twitter" },
  { name: "Facebook" },
]);

const ScheduleArticle = ({
  onCancel,
  handlePublish,
  contentData,
}: ScheduleArticleProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<PublishForm>({
    defaultValues: {
      time: "",
      primaryPlatform: "All Platform",
      additionalPlatforms: [],
      type: [],
      date: undefined,
    },
  });

  useEffect(() => {
    if (contentData) {
      reset({
        time: contentData.scheduledTime || "",
        date: contentData.scheduledDate
          ? new Date(contentData.scheduledDate)
          : undefined,
        primaryPlatform:
          contentData.scheduledPlatforms.length == 1
            ? contentData.scheduledPlatforms[0]
            : "All Platform",
        additionalPlatforms: contentData.scheduledPlatforms || [],
        type: [],
      });
    }
  }, [contentData, reset]);

  const handlePrimaryPlatform = (platform: string) => {
    setValue("primaryPlatform", platform);
    if (platform === "All Platform") {
      setValue("additionalPlatforms", []);
    }
  };

  const handleOtherPlatforms = (platform: string) => {
    const currentAdditionalPlatforms = watch("additionalPlatforms");
    const newAdditionalPlatforms = currentAdditionalPlatforms.includes(platform)
      ? currentAdditionalPlatforms.filter((p) => p !== platform)
      : [...currentAdditionalPlatforms, platform];
    setValue("additionalPlatforms", newAdditionalPlatforms);
  };

  const validateFutureDateTime = () => {
    const { date, time } = getValues();
    if (!date || !time) {
      return "Date and time are required.";
    }

    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    if (selectedDateTime < now) {
      return "Selected time cannot be in the past.";
    }

    return true;
  };

  const onSubmit = async (data: PublishForm) => {
    const validationResult = validateFutureDateTime();
    if (validationResult !== true) {
      toast.error(validationResult);
      return;
    }

    if (!data.date) return;

    const platforms =
      data.primaryPlatform === "All Platform"
        ? CONTENT_TABS.slice(1).map((tab) => tab.name)
        : [data.primaryPlatform, ...data.additionalPlatforms];

    const oldDate = contentData?.scheduledDate
      ? new Date(contentData.scheduledDate).toISOString().split("T")[0]
      : null;
    const newDate = data.date.toISOString().split("T")[0];

    const oldTime = contentData?.scheduledTime || "";
    const newTime = data.time;

    const oldPlatforms = contentData?.scheduledPlatforms?.sort() || [];
    const newPlatforms = platforms.sort();

    const isSameDate = oldDate === newDate;
    const isSameTime = oldTime === newTime;
    const isSamePlatforms =
      JSON.stringify(oldPlatforms) === JSON.stringify(newPlatforms);

    if (isSameDate && isSameTime && isSamePlatforms) {
      toast.error("Please modify date, time, or platforms before submitting.");
      return;
    }
    const isEdit = Boolean(contentData?.scheduledTime);

    await handlePublish(platforms, data.time, data.date.toISOString(), isEdit);
    toast.success("Schedule updated successfully!");
    onCancel();
  };

  const primaryPlatform = watch("primaryPlatform");
  const additionalPlatforms = watch("additionalPlatforms");
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex justify-center items-center flex-col gap-3">
        <Toaster richColors position="top-center" />
        <button className="bg-white rounded-full p-1" onClick={onCancel}>
          <X size={20} />
        </button>
        <div className="bg-[#FFFFFF] relative pt-5 space-y-3 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5">
              <h1 className="font-semibold text-[#101828] text-xl">
                Schedule an Article
              </h1>
              <div className="border-b-[1px] border-[rgba(0, 0, 0, 0.2)] my-4" />

              {/* Platform Tabs */}
              <div className="flex items-center justify-between py-2 bg-[#ffffff] border border-[#6A728233] shadow-[0px_2px_15px_0px_rgba(100,100,111,0.1)] px-3 max-w-max h-min rounded-[8px]">
                <div className="flex space-x-1 bg-[#6A72821A] p-1 rounded-[4px] w-fit">
                  {CONTENT_TABS.map((tab) => (
                    <button
                      type="button"
                      key={tab.name}
                      onClick={() => handlePrimaryPlatform(tab.name)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                        primaryPlatform === tab.name
                          ? "bg-white text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="w-full gap-6 py-4 flex">
                {/* Date Picker */}
                <div className="min-w-96">
                  <label className="block text-[15px]  text-[#03101F] mb-1">
                    Select Date
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePickerComponent
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(selectedDate: string) =>
                          field.onChange(new Date(selectedDate))
                        }
                        placeholder="Date"
                        className={cn(
                          "border border-[#ECECEC] bg-[#F7FBF7] hover:bg-[#F7FBF7] placeholder:text-[#03101F]",
                          errors.date && "border-red-500"
                        )}
                      />
                    )}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Time Picker */}
                <div className="min-w-96 w-full">
                  <label className="block text-[15px] text-[#03101F] mb-1">
                    Enter Time
                  </label>
                  <div
                    className={cn(
                      "border flex items-center h-10 justify-between w-full p-1.5 rounded-[8px] border-[#ECECEC] bg-[#F7FBF7]",
                      errors.time && "border-red-500"
                    )}
                    onClick={() =>
                      inputRef.current?.showPicker?.() ||
                      inputRef.current?.focus()
                    }
                  >
                    <input
                      type="time"
                      {...register("time", {
                        required: "Time is required",
                        validate: () => {
                          const result = validateFutureDateTime();
                          return result === true || result;
                        },
                      })}
                      ref={(e) => {
                        register("time").ref(e);
                        inputRef.current = e;
                      }}
                      placeholder="00:00"
                      className="bg-transparent outline-none w-full
                        [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <Clock className="h-5" />
                  </div>
                  {errors.time && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.time.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Platforms */}
              <div className="min-h-20">
                {primaryPlatform !== "All Platform" && (
                  <>
                    <p className="text-[12px] pb-2 font-semibold text-[#6A7282]">
                      Same as:
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      {CONTENT_TABS.slice(1)
                        .filter((a) => a.name !== primaryPlatform)
                        .map((tab) => (
                          <div
                            key={tab.name}
                            onClick={() => handleOtherPlatforms(tab.name)}
                            className={cn(
                              "flex items-center bg-[#F0F1F2] text-[#6A7282] w-max py-2 px-3 rounded-[8px] space-x-2 cursor-pointer",
                              additionalPlatforms.includes(tab.name) &&
                                "!bg-[#008001] !text-[#F0F1F2]"
                            )}
                          >
                            <p className="font-semibold text-[14px]">
                              {tab.name}
                            </p>
                            <PlatformIcon
                              name={tab.name}
                              color={
                                additionalPlatforms.includes(tab.name)
                                  ? "#FFFFFF"
                                  : "#2C3E50"
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex w-full relative  border-t border-white justify-end">
              <div className="flex gap-6 p-4 bg-[#FFFFFF] shadow-[0px_2px_10px_0px_#0000001A,_0px_0px_2px_0px_#00000033] w-full justify-end rounded-b-2xl">
                <Button
                  type="button"
                  className="border rounded-[8px] h-10 w-32 border-[#008001] text-[#008001] bg-[#fff]  text-[14px] hover:bg-white"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="border rounded-[8px] h-10 w-32 border-[#008001] text-[#fff] bg-[#008001]  text-[14px] hover:bg-[#008001]"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleArticle;
