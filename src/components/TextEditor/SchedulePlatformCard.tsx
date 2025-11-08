import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Calendar,
  Minus,
} from "lucide-react";
import { Card } from "../ui/card";
import type { scheduledPostArray } from "@/types/apitypes";

interface PublishPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  checked: boolean;
  date?: string;
  time?: string;
}

interface PublishPlatformSelectorProps {
  schedulePost: scheduledPostArray[];
  isOpen: boolean;
  onClose: () => void;
  onPublish: (selectedPlatforms: string[]) => void;
}

export function SchedulePlatformCard({
  schedulePost,
  isOpen,
  onClose,
  onPublish,
}: PublishPlatformSelectorProps) {
  const platformIcons: Record<string, React.ReactNode> = {
    web: <Globe className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
  };

  const [platforms, setPlatforms] = useState<PublishPlatform[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const unposted = schedulePost
      .filter((p) => !p.isPosted)
      .map((p) => ({
        id: p.platform,
        name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
        icon: platformIcons[p.platform] ?? null,
        checked: false,
        date:
          typeof p.date === "string"
            ? p.date
            : p.date.toISOString().split("T")[0],
        time: p.time,
      }));

    const withAll: PublishPlatform[] = [
      { id: "all", name: "All", icon: null, checked: false },
      ...unposted,
    ];

    setPlatforms(withAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedulePost]);

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms((prev) => {
      if (platformId === "all") {
        const newChecked = !prev[0].checked;
        return prev.map((p) => ({ ...p, checked: newChecked }));
      } else {
        const updated = prev.map((p) =>
          p.id === platformId ? { ...p, checked: !p.checked } : p
        );

        // auto-check “All” if all others selected
        const allSelected = updated
          .filter((p) => p.id !== "all")
          .every((p) => p.checked);
        updated[0].checked = allSelected;

        return updated;
      }
    });
  };

  const handlePublish = () => {
    const selectedPlatforms = platforms
      .filter((p) => p.checked && p.id !== "all")
      .map((p) => p.id);
    if (selectedPlatforms.length === 0) return;
    onPublish(selectedPlatforms);
    onClose();
  };

  if (!isOpen) return null;

  const unpostedPlatforms = platforms.filter((p) => p.id !== "all");
  const hasNoPlatforms = unpostedPlatforms.length === 0;

  return (
    <Card
      ref={cardRef}
      className="bg-white rounded-[12px] gap-2 shadow-lg border border-gray-200 p-3 max-w-[238px]"
    >
      <div className="space-y-2">
        {hasNoPlatforms ? (
          <p className="text-sm text-[#6A7282] text-center">
            All posts are already published.
          </p>
        ) : (
          platforms.map((platform, indx) => (
            <div
              key={platform.id + indx}
              className="flex items-center gap-3 py-2"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={platform.id}
                  checked={platform.checked}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className="data-[state=checked]:bg-green-600 h-4 w-4 data-[state=checked]:border-green-600"
                />
                <label
                  htmlFor={platform.id}
                  className="flex items-center space-x-1 text-sm font-semibold text-[#6A7282] cursor-pointer"
                >
                  {platform.icon}
                  {platform.id === "all" && <span>{platform.name}</span>}{" "}
                  {/* ✅ Now always shows name */}
                </label>
              </div>

              {platform.id !== "all" && (
                <div className="text-xs flex text-[#6A7282]">
                  (<span>{platform.date}</span>{" "}
                  <span className="text-[#6A7282] p-0  h-0.5 text-[12px]">
                    <Minus className="rotate-90 h-4 w-4" />
                  </span>
                  <span>{platform.time}</span>)
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!hasNoPlatforms && (
        <Button
          variant="outline"
          onClick={handlePublish}
          disabled={platforms.every((p) => !p.checked || p.id === "all")}
          className=" bg-white text-[#FB2C36] border border-[#FB2C36] hover:bg-white hover:text-[#FB2C36] "
        >
          <Calendar className="w-4 h-4 mr-2" color="#FB2C36" />
          Cancel
        </Button>
      )}
    </Card>
  );
}
