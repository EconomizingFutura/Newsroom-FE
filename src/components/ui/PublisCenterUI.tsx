import { Globe, Facebook, Instagram, Twitter } from "lucide-react";
import type { scheduledPostArray } from "@/types/apitypes";
import { useLocation } from "react-router";
import { cn } from "./utils";

interface ScheduledPlatformsUIProps {
  scheduledArr: scheduledPostArray[];
  columns?: number; // 👈 control how many columns in grid (default 4)
}

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
  columns = 1,
}) => {
  const published = scheduledArr.filter((a) => a.isPosted);
  const upcoming = scheduledArr.filter((a) => !a.isPosted);
  const path = useLocation();
  const pname = "/editor/publishCenter";

  const gridClass =
    path.pathname == pname
      ? "flex gap-3"
      : `grid grid-cols-2 sm:grid-cols-${columns} gap-x-4 gap-y-2`;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 text-sm text-slate-700",
        path.pathname == pname && "flex flex-row"
      )}
    >
      {/* ✅ Published Section */}
      {published.length > 0 && (
        <div className={cn(path.pathname == pname && "flex items-center")}>
          <div className="font-semibold text-[#00B401] text-[12px] mx-0.5">
            Published:
          </div>
          <div className={gridClass}>
            {published.map((a, idx) => (
              <div
                key={`${a.platform}-published-${idx}`}
                className={cn(
                  "flex flex-wrap items-center gap-1 text-[12px] text-[#00B401]",
                  path.pathname !== pname
                )}
              >
                {returnPlatformIcon(a.platform, true)}
                {path.pathname !== pname && (
                  <span className="whitespace-normal break-words leading-tight">
                    {a.date.toString()} {a.time}
                  </span>
                )}

                {idx !== published.length - 1 && (
                  <span className="text-slate-400">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Upcoming Section */}
      {upcoming.length > 0 && (
        <div>
          {upcoming.length > 0 && path.pathname !== pname && (
            <div className="text-[#4A5565] text-[12px] mb-1">Upcoming:</div>
          )}
          <div className={gridClass}>
            {upcoming.map((a, idx) => (
              <div
                key={`${a.platform}-upcoming-${idx}`}
                className="flex flex-wrap items-center gap-1 text-[12px] text-slate-700"
              >
                {returnPlatformIcon(a.platform, false)}
                <span className="whitespace-normal break-words leading-tight">
                  {a.date.toString()} {a.time}
                </span>
                {idx !== upcoming.length - 1 && path.pathname == pname && (
                  <span className="text-slate-400">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
