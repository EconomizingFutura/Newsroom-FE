import { Clock, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { DatePickerComponent, PlatformIcon } from "@/utils/calendarUtils";
import { useRef } from "react";

interface ScheduleArticleProps {
  onCancel: () => void;
  handlePublish: (platforms: string[], time: string, date: string) => void;
}

interface PublishForm {
  type: string[];
  date: Date;
  time: string;
  primaryPlatform: string;
  additionalPlatforms: string[];
}

const CONTENT_TABS = Object.freeze([
  {
    name: "All Platform",
  },
  {
    name: "Web",
  },
  {
    name: "Instagram",
  },
  {
    name: "Twitter",
  },
  {
    name: "Facebook",
  },
]);

const ScheduleArticle = ({ onCancel, handlePublish }: ScheduleArticleProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
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

  const handlePrimaryPlatform = (platform: string) => {
    setValue("primaryPlatform", platform);
    // Clear additional platforms when switching to "All Platform"
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

  const onSubmit = async (data: PublishForm) => {
    const platforms =
      data.primaryPlatform === "All Platform"
        ? CONTENT_TABS.slice(1).map((tab) => tab.name)
        : [data.primaryPlatform, ...data.additionalPlatforms];

    const formData = {
      ...data,
      type: platforms,
    };
    await handlePublish(platforms, data.time, data.date.toISOString());

    console.log("Form submitted:", formData);
    onCancel();
  };

  const primaryPlatform = watch("primaryPlatform");
  const additionalPlatforms = watch("additionalPlatforms");
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="flex justify-center items-center flex-col gap-3">
        <button className="bg-white rounded-full p-1" onClick={onCancel}>
          <X size={20} />
        </button>
        <div className="bg-[#FFFFFF] relative pt-5 space-y-3 rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-5">
              <h1 className="font-bold text-[#101828] text-xl">
                Schedule a article
              </h1>
              <div className="border border-[rgba(0, 0, 0, 0.2)] my-2" />
              <div className="flex items-center justify-between py-2 bg-[#ffffff] border border-[#6A728233] shadow-[0px_2px_15px_0px_rgba(100,100,111,0.1)] px-3 max-w-max h-min rounded-[8px]">
                <div className="flex space-x-1 bg-[#6A72821A] p-1 rounded-[4px] w-fit">
                  {CONTENT_TABS.map((tab) => (
                    <button
                      type="button"
                      key={tab.name}
                      onClick={() => handlePrimaryPlatform(tab.name)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                        primaryPlatform === tab.name
                          ? "bg-white text-gray-900 "
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full gap-6 py-4 flex">
                <div className="min-w-96">
                  <label className="block text-[16px] font-semibold text-[#03101F] mb-1">
                    Select Date
                  </label>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePickerComponent
                        value={
                          field.value
                            ? field.value.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(selectedDate: string) => {
                          field.onChange(new Date(selectedDate));
                        }}
                        placeholder="Select Date"
                        className={cn(
                          "border border-[#ECECEC] bg-[#F7FBF7]",
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
                <div className="min-w-96 w-full">
                  <label className="block text-[16px] font-semibold text-[#03101F] mb-1">
                    Select Time
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
                      })}
                      ref={(e) => {
                        register("time").ref(e);
                        inputRef.current = e;
                      }}
                      className="bg-transparent outline-none w-full
                 [&::-webkit-calendar-picker-indicator]:opacity-0
          "
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
              <div className="min-h-20">
                {primaryPlatform !== "All Platform" && (
                  <>
                    <p className="text-[12px] pb-2 font-semibold text-[#6A7282]">
                      Same as:
                    </p>
                    <div className="flex gap-4">
                      {CONTENT_TABS.slice(1)
                        .filter((a) => a.name !== primaryPlatform)
                        .map((tab) => (
                          <div
                            onClick={() => handleOtherPlatforms(tab.name)}
                            key={tab.name}
                            className={cn(
                              "flex items-center bg-[#F0F1F2] text-[#6A7282] w-max py-2 px-3 rounded-[8px] space-x-2",
                              additionalPlatforms.includes(tab.name) &&
                                "!bg-[#008001] !text-[#F0F1F2]",
                              "cursor-pointer"
                            )}
                          >
                            <p className="font-semibold text-[14px]">
                              {tab.name}
                            </p>{" "}
                            <PlatformIcon
                              name={tab.name}
                              color={
                                additionalPlatforms.includes(tab.name)
                                  ? "#FFFFFF"
                                  : "#2C3E50"
                              }
                            />{" "}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex w-full relative border-t border-white justify-end">
              <div className="flex gap-6 p-4">
                <Button
                  type="button"
                  className="border rounded-[8px] h-10 w-32 border-[#008001] text-[#008001] bg-[#fff] font-semibold text-[14px] hover:bg-white"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="border rounded-[8px] h-10 w-32 border-[#008001] text-[#fff] bg-[#008001] font-semibold text-[14px] hover:bg-[#008001]"
                >
                  Submit
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
