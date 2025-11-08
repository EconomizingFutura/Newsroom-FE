import { Globe, Facebook, Instagram, Twitter } from "lucide-react";
import type { scheduledPostArray } from "@/types/apitypes";

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

export const scheduledPlatformsUI = (scheduledArr: scheduledPostArray[]) => {
  const published = scheduledArr.filter((a) => a.isPosted);
  const upcoming = scheduledArr.filter((a) => !a.isPosted);

  return (
    <div className="flex items-center gap-3 text-sm text-slate-700">
      {published.length > 0 && (
        <>
          <span className="font-semibold text-[#00B401] text-[12px]">
            Published:
          </span>

          {published.map((a, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 text-[12px] text-[#00B401]"
            >
              {returnPlatformIcon(a.platform, true)}
            </span>
          ))}

          {upcoming.length > 0 && (
            <span className="text-[#4A5565] text-[12px]">|</span>
          )}
        </>
      )}

      {upcoming.map((a, idx) => (
        <span
          key={idx}
          className="flex items-center gap-1 text-[12px] text-slate-700"
        >
          {returnPlatformIcon(a.platform, false)}
          {a.date.toString()} {a.time}
          {idx !== upcoming.length - 1 && (
            <span className="me-1 text-slate-400 text-[12px]">|</span>
          )}
        </span>
      ))}
    </div>
  );
};
