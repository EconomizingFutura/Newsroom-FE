import { Globe, Facebook, Instagram, Twitter } from "lucide-react";
import type { scheduledPostArray } from "@/types/apitypes";

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
  columns = 4, // 👈 default 4 columns
}) => {
  const published = scheduledArr.filter((a) => a.isPosted);
  const upcoming = scheduledArr.filter((a) => !a.isPosted);

  // 🧩 dynamically build grid-cols-{n} class
  const gridClass = `grid grid-cols-2 sm:grid-cols-${columns} gap-x-4 gap-y-2`;

  return (
    <div className="flex flex-col gap-2 text-sm text-slate-700">
      {/* ✅ Published Section */}
      {published.length > 0 && (
        <div>
          <div className="font-semibold text-[#00B401] text-[12px] mb-1">
            Published:
          </div>
          <div className={gridClass}>
            {published.map((a, idx) => (
              <div
                key={`${a.platform}-published-${idx}`}
                className="flex flex-wrap items-center gap-1 text-[12px] text-[#00B401]"
              >
                {returnPlatformIcon(a.platform, true)}
                <span className="whitespace-normal break-words leading-tight">
                  {a.date.toString()} {a.time}
                </span>
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
          {upcoming.length > 0 && (
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
                {/* {idx !== upcoming.length - 1 && (
                  <span className="text-slate-400">|</span>
                )} */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
