import { Globe, Facebook, Instagram, Twitter } from "lucide-react";
import type { scheduledPostArray } from "@/types/apitypes";
import { useLocation } from "react-router";
import { cn } from "./utils";

interface ScheduledPlatformsUIProps {
  scheduledArr: scheduledPostArray[];
  columns?: number; // 👈 control how many columns in grid (default 4)
}

// eslint-disable-next-line react-refresh/only-export-components
export const returnPlatformIcon = (platform: string, isPublished: boolean) => {
  const colorClass = isPublished
    ? "text-[#00B401] h-5 w-5"
    : "text-[#1E2939] h-5 w-5";

  switch (platform.toLowerCase()) {
    case "web":
      return <Globe className={colorClass} />;
    case "facebook":
      return <Facebook className={colorClass} />;
    case "instagram":
      return <Instagram className={colorClass} />;
    case "twitter":
      return <Twitter className={colorClass} />;
    default:
      return <Globe className={colorClass} />;
  }
};

export const ScheduledPlatformsUI: React.FC<ScheduledPlatformsUIProps> = ({
  scheduledArr,
}) => {
  const published = scheduledArr.filter((a) => a.isPosted);
  const upcoming = scheduledArr.filter((a) => !a.isPosted);
  const path = useLocation();
  const pname = "/editor/publishCenter";
  const clendarPath = "/editor/calendarView";

  const sorted = scheduledArr.sort((a, b) =>
    a.isPosted === b.isPosted ? 0 : a.isPosted ? -1 : 1
  );

  return (
    <div
      className={cn(
        "flex gap-2 text-sm text-slate-700",
        path.pathname == pname && "flex-row"
      )}
    >
      <div className="flex items-start flex-wrap gap-2">
        {published.length > 0 && (
          <div className="font-semibold text-[#00B401] text-[12px] me-3">
            Published:
          </div>
        )}

        <div className="flex flex-wrap gap-3 items-center">
          {sorted.map((item, idx) => (
            <div
              key={item.platform}
              className="flex items-center gap-2 flex-wrap"
            >
              {returnPlatformIcon(item.platform, item.isPosted)}

              {/* Upcoming items */}
              {!item.isPosted && (
                <span className="text-[12px] text-slate-700 whitespace-nowrap">
                  {item.date.toString()} {item.time}
                </span>
              )}
              {idx !== sorted.length - 1 && !item.isPosted && (
                <span className="text-slate-400 mx-1">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const gridClass =
    path.pathname == pname
      ? "flex  gap-3"
      : cn(
          `flex flex-row  gap-x-4 gap-y-2`,
          path.pathname == clendarPath && upcoming.length > 3
            ? "grid w-9/12 gap-4 grid-cols-2"
            : ""
        );

  return (
    <div
      className={cn(
        "flex gap-2 text-sm text-slate-700",
        path.pathname == pname && "flex flex-row "
      )}
    >
      {/* ✅ Published Section */}
      {published.length > 0 && (
        <div className={cn("flex items-center")}>
          <div className="font-semibold text-[#00B401] text-[12px] mx-0.5">
            Published:
          </div>
          <div
            className={cn(
              gridClass,
              path.pathname == clendarPath && "ms-1 flex gap-2"
            )}
          >
            {published.map((a, idx) => (
              <div
                key={`${a.platform}-published-${idx}`}
                className={cn(
                  "flex flex-wrap items-center gap-1 text-[12px] text-[#00B401]"
                )}
              >
                {returnPlatformIcon(a.platform, true)}
                {/* {path.pathname !== pname && (
                  <span className="whitespace-normal break-words leading-tight">
                    {a.date.toString()} {a.time}
                  </span>
                )} */}

                {idx !== published.length - 1 &&
                  path.pathname !== clendarPath && (
                    <span className="text-slate-400">|</span>
                  )}
              </div>
            ))}
          </div>
          {published.length > 0 && path.pathname !== clendarPath && (
            <span className="text-slate-400   ms-2">|</span>
          )}
        </div>
      )}

      {/* ✅ Upcoming Section */}
      {upcoming.length > 0 && (
        <div className={gridClass}>
          {upcoming.map((a, idx) => (
            <div
              key={`${a.platform}-upcoming-${idx}`}
              className="flex flex-wrap items-center gap-1 text-[12px] text-slate-700"
            >
              {returnPlatformIcon(a.platform, false)}
              <span className="whitespace-normal wrap-break-word leading-tight">
                {a.date.toString()} {a.time}
              </span>
              {idx !== upcoming.length - 1 && path.pathname == pname && (
                <span className="text-slate-400">|</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
