import { Clock, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { DatePickerComponent, PlatformIcon } from "@/utils/calendarUtils";
import type { contentResponse } from "@/types/apitypes";
import { Toaster, toast } from "sonner";

interface ScheduleArticleProps {
  onCancel: () => void;
  handlePublish: (
    platformSchedules: { platformName: string; date: string; time: string }[],
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
  const [hovered, setHovered] = useState(false);


  const [platformSchedules, setPlatformSchedules] = useState<
    Record<string, { date?: Date; time?: string } | null>
  >({
    "All Platform": null,
    Web: null,
    Instagram: null,
    Twitter: null,
    Facebook: null,
  });

  useEffect(() => {
    if (contentData) {
      const initialDate = contentData.scheduledDate
        ? new Date(contentData.scheduledDate)
        : undefined;
      const initialTime = contentData.scheduledTime || "";

      const updatedSchedules: Record<string, any> = {};
      CONTENT_TABS.forEach((tab) => {
        updatedSchedules[tab.name] = {
          date: initialDate,
          time: initialTime,
        };
      });

      reset({
        time: initialTime,
        date: initialDate,
        primaryPlatform:
          contentData.scheduledPlatforms.length === 1
            ? contentData.scheduledPlatforms[0]
            : "All Platform",
        additionalPlatforms: contentData.scheduledPlatforms || [],
        type: [],
      });

      setPlatformSchedules(updatedSchedules);
    }
  }, []);

  const handlePrimaryPlatform = (newPlatform: string) => {
    const currentPlatform = getValues("primaryPlatform");
    const currentDate = getValues("date");
    const currentTime = getValues("time");

    console.log("Switching from", currentPlatform, "to", newPlatform);
    console.log("Switching from", platformSchedules);

    // ✅ Save current platform’s values before switching
    if (currentPlatform && (currentDate || currentTime)) {
      setPlatformSchedules((prev) => ({
        ...prev,
        [currentPlatform]: { date: currentDate, time: currentTime },
      }));
    }

    // ✅ Now switch to new platform
    setValue("primaryPlatform", newPlatform);

    if (newPlatform === "All Platform") {
      setValue("additionalPlatforms", []);
    }

    // ✅ Load that platform’s previous schedule (if any)
    const current = platformSchedules[newPlatform];
    setValue("date", current?.date || undefined);
    setValue("time", current?.time || "");
  };

const handleAllPlatformSchedule = (date: Date, time: string) => {
  const updated = Object.fromEntries(
    Object.keys(platformSchedules).map((p) => [
      p,
      p === "All Platform" ? { date, time } : { date, time },
    ])
  );

  setPlatformSchedules(updated);
  setValue("date", date);
  setValue("time", time);
};

  const handleIndividualPlatformSchedule = (
    platform: string,
    date: Date,
    time: string
  ) => {
    setPlatformSchedules((prev) => ({
      ...prev,
      [platform]: { date, time },
      "All Platform": null, // clear global schedule
    }));
    setValue("date", date);
    setValue("time", time);
  };

  const handleSameAs = (currentPlatform: string, sourcePlatform: string) => {
    const source = platformSchedules[sourcePlatform];
    if (!source?.date || !source?.time) return;

    setPlatformSchedules((prev) => ({
      ...prev,
      [currentPlatform]: { ...source },
    }));
    setValue("date", source.date);
    setValue("time", source.time);
  };



  const validateFutureDateTime = () => {
    const { date, time } = getValues();
    if (!date || !time) return "Date and time are required.";

    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    if (selectedDateTime < now) return "Selected time cannot be in the past.";
    return true;
  };
const onSubmit = async (data: PublishForm) => {
  const validationResult = validateFutureDateTime();
  if (validationResult !== true) {
    toast.error(validationResult);
    return;
  }

  const currentPlatform = getValues("primaryPlatform");
  const currentDate = getValues("date");
  const currentTime = getValues("time");

  // ✅ Persist the current tab’s changes before submission
  setPlatformSchedules((prev) => ({
    ...prev,
    [currentPlatform]: { date: currentDate, time: currentTime },
  }));

  // ✅ Build final payload using stored platformSchedules
  const finalSchedules = Object.entries(platformSchedules)
    .filter(([name, value]) => name !== "All Platform" && value?.date && value?.time)
    .map(([platformName, value]) => ({
      platformName,
      date: value!.date!.toISOString().split("T")[0],
      time: value!.time!,
    }));

  // ✅ If “All Platform” is selected, override everything
  if (currentPlatform === "All Platform" && currentDate && currentTime) {
    const allPayload = CONTENT_TABS.slice(1).map((tab) => ({
      platformName: tab.name,
      date: currentDate.toISOString().split("T")[0],
      time: currentTime,
    }));
    console.log("📦 Final Payload (All Platforms):", allPayload);
    handlePublish(allPayload, Boolean(contentData?.scheduledTime));
    toast.success("Scheduled for all platforms!");
    onCancel();
    return;
  }

  console.log("📦 Final Payload:", finalSchedules);
  handlePublish(finalSchedules, Boolean(contentData?.scheduledTime));
  toast.success("Schedule updated successfully!");
 // onCancel();
};

  const primaryPlatform = watch("primaryPlatform");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDateChange = (selectedDate: string) => {
    const newDate = new Date(selectedDate);
    const currentTime = getValues("time");
    if (primaryPlatform === "All Platform") {
      handleAllPlatformSchedule(newDate, currentTime);
    } else {
      handleIndividualPlatformSchedule(primaryPlatform, newDate, currentTime);
    }
  };

  const handleTimeChange = (newTime: string) => {
    const currentDate = getValues("date");
    if (!currentDate) return;
    if (primaryPlatform === "All Platform") {
      handleAllPlatformSchedule(currentDate, newTime);
    } else {
      handleIndividualPlatformSchedule(primaryPlatform, currentDate, newTime);
    }
  };

  const hasAnyPlatformScheduled = Object.entries(platformSchedules).some(
    ([name, val]) =>
      name !== primaryPlatform && val?.date && val?.time
  );

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
                      className={`px-4 py-2 rounded-md text-sm text-[14px]  transition-all flex items-center space-x-2 ${primaryPlatform === tab.name
                        ? "bg-white text-[#1E2939] font-bold"
                        : "text-gray-500 hover:text-gray-700 font-medium"
                        }`}
                    >
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time */}
              <div className="w-full gap-6 py-4 flex">
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
                        onChange={handleDateChange}
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
                      })}
                      ref={(e) => {
                        register("time").ref(e);
                        inputRef.current = e;
                      }}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      value={getValues("time")}
                      placeholder="00:00"
                      className="bg-transparent outline-none w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
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
              <div className="min-h-24">
                {/* Same As Section */}
                {primaryPlatform !== "All Platform" && hasAnyPlatformScheduled && (
                  <>
                    <p className="text-[12px] pb-2 font-semibold text-[#6A7282]">
                      Same as:
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      {Object.entries(platformSchedules)
                        .filter(
                          ([name, val]) =>
                            name !== primaryPlatform &&
                            name !== "All Platform" &&
                            val?.date &&
                            val?.time
                        )
                        .map(([name]) => (
                          <div
                            key={name}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            onClick={() => handleSameAs(primaryPlatform, name)}
                            className="flex items-center bg-[#F0F1F2] text-[#6A7282] w-max py-2 px-3 rounded-[8px] space-x-2 cursor-pointer hover:bg-[#008001] hover:text-white"
                          >
                            <PlatformIcon name={name} color={!hovered ? "#2C3E50" : "#ffffff"} />

                            <p className="font-semibold  text-[14px]">{name}</p>
                          </div>
                        ))}
                    </div>
                  </>
                )}

              </div>

            </div>

            {/* Buttons */}
            <div className="flex w-full relative border-t border-white justify-end">
              <div className="flex gap-6 p-4 bg-[#FFFFFF] shadow-[0px_2px_10px_0px_#0000001A,_0px_0px_2px_0px_#00000033] w-full justify-end rounded-b-2xl">
                <Button
                  type="button"
                  className="border rounded-[8px] h-10 w-32 border-[#008001] text-[#008001] bg-[#fff] text-[14px] hover:bg-white"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="border rounded-[8px] h-10 w-32 border-[#008001] text-[#fff] bg-[#008001] text-[14px] hover:bg-[#008001]"
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
