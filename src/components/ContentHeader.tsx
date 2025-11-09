import { Grid3x3, List, MoveLeft, PenLine, Save, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { HeaderIcon, type HeaderKey } from "@/utils/HeaderIcons";
import { cn } from "./ui/utils";
import { createPortal } from "react-dom";
import { SchedulePlatformCard } from "./TextEditor/SchedulePlatformCard";

interface ContentHeaderProps {
  text: string;
  onClick?: () => void;
  description?: string;
  showSaveSubmit?: boolean;
  onClickGridList?: [() => void, () => void, viewMode: string];
  onClickSubmitSave?: (() => void)[];
  onClickBack?: () => void;
  showGrid?: boolean;
  number?: number;
  showBackButton?: boolean;
  showArticle?: boolean;
  iconName?: HeaderKey;
  showEdit?: boolean;
  handleEdit?: () => void;
  showCancelSchedule?: boolean;
  handleEditPopup?: () => void;
  handleCancel?: (id: string, platforms?: string[]) => void;
  story?: any;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  text,
  description,
  showSaveSubmit,
  showGrid,
  number,
  showBackButton,
  showArticle,
  iconName,
  onClickGridList,
  onClickBack,
  showEdit,
  handleEdit,
  showCancelSchedule,
  handleEditPopup,
  handleCancel,
  story

}) => {

  const [showScheduleCard, setShowScheduleCard] = useState(false);
  const scheduleCardRef = useRef<HTMLDivElement>(null);
  const scheduleButtonRef = useRef<HTMLButtonElement>(null);
  const [scheduleButtonRect, setScheduleButtonRect] = useState<DOMRect | null>(
    null
  );

  return (
    <div className="flex justify-between">
      <div>
        <h1 className=" font-bold text-2xl flex items-center gap-2 text-[#101828]">
          <div className="flex flex-col gap-[12px]">
            <div className="relative items-center flex gap-2">
              {showBackButton && (
                <Button
                  onClick={onClickBack}
                  variant="ghost"
                  size="sm"
                  className="border border-[#E5E7EB] h-10 w-10  bg-[#F8FAF9] text-[#2C3E50] rounded-[8.5px]"
                >
                  <MoveLeft className="w-4 h-4" />
                </Button>
              )}
              {showArticle && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="border border-[#E5E7EB] h-10 w-10 hover:bg-[#2B7FFF]  bg-[#2B7FFF] text-[#2C3E50] rounded-[8.5px]"
                >
                  <HeaderIcon className=" text-white" name="Text Article" />
                </Button>
              )}
              {iconName && (
                <HeaderIcon className=" text-[#008001]" name={iconName} />
              )}
              <p className="text-[#101828] ">{text}</p>
              {number !== undefined && number > 0 && (
                <p className=" border border-[#B3E6B3] p-0.5 px-2.5 text-[#006601] rounded-full font-font1 font-medium text-[10.5px] leading-[14px] tracking-normal text-center align-middle text-[#006601 border border-[#B3E6B3] h-min w-min font-medium text-[10.5px] leading-3.5 bg-[#D9F2D9]  top-0 left-">
                  {number}
                </p>
              )}
            </div>

            <p className="font-openSans font-normal text-base leading-[100%] tracking-normal align-middle text-[#4A5565]">
              {description}
            </p>
          </div>
        </h1>
      </div>
      {showGrid && (
        <div className="flex items-center gap-2 px-2">
          <Button
            onClick={onClickGridList?.[0]}
            variant="ghost"
            size="sm"
            className={cn(
              "border border-[#E5E7EB] h-10 w-10 bg-[#F8FAF9] text-[#2C3E50] rounded-[8.5px]",
              onClickGridList?.[2] === "grid"
                ? "bg-[#B3E6B3] text-[#006601]"
                : ""
            )}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onClickGridList?.[1]}
            variant="ghost"
            size="sm"
            className={cn(
              "border border-[#E5E7EB] h-10 w-10 bg-[#F8FAF9] text-[#2C3E50] rounded-[8.5px]",
              onClickGridList?.[2] === "list"
                ? "bg-[#B3E6B3] text-[#006601]"
                : ""
            )}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      )}
      {(showEdit || showCancelSchedule) && (
        <div className="flex gap-2">
          {showEdit && (
            <Button
              variant="outline"
              onClick={handleEdit}
              className="text-[#1E2939] cursor-pointer hover:text-[#1E2939]  border-[#E5E7EB] hover:bg-[#F8FAF9]"
            >
              <PenLine color="#1E2939" className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {showCancelSchedule && (
            <div className="relative">
              <Button
                variant="outline"
                ref={scheduleButtonRef}
                onClick={() => {
                  if (scheduleButtonRef.current) {
                    setScheduleButtonRect(
                      scheduleButtonRef.current.getBoundingClientRect()
                    );
                  }
                  setShowScheduleCard(true);
                }}

                className="text-[#1E2939] cursor-pointer hover:text-[#1E2939]  border-[#1E2939] hover:bg-[#F8FAF9]"
              >
                <X color="#1E2939" className="w-4 h-4 mr-2" />
                Cancel Schedule
              </Button>
              {showScheduleCard && story &&
                createPortal(
                  <div
                    ref={scheduleCardRef}
                    className="fixed z-50 bg-white shadow-lg rounded-lg"
                    style={{
                      top: scheduleButtonRect?.top ?? 0,
                      left: scheduleButtonRect?.left ?? 0,
                      transform: "translateY(20%) translateX(-10%)",
                    }}
                  >
                    <SchedulePlatformCard
                      schedulePost={story.scheduledPosts}
                      isOpen={showScheduleCard}
                      onClose={() => setShowScheduleCard(false)}
                      onPublish={(platforms) => {
                        handleCancel?.(story.id, platforms);
                        setShowScheduleCard(false);
                        handleEditPopup?.();
                      }}
                    />
                  </div>,
                  document.body
                )}
            </div>

          )}
        </div>
      )}

      {showSaveSubmit && (
        <div className="flex items-center gap-2 px-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2   border-[#B3E6B3] bg-[#F0F9F0] text-[#008001]"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            size="sm"
            className="bg-green-600 text-white hover:bg-green-700 gap-2"
          >
            <Send className="w-4 h-4" />
            Submit for Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
