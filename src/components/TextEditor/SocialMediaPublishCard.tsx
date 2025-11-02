import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Instagram, Facebook, Twitter, Send } from "lucide-react";
import { Card } from "../ui/card";

interface PublishPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  checked: boolean;
}

interface PublishPlatformSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (selectedPlatforms: string[]) => void;
}

export function SocialMediaPublishCard({
  isOpen,
  onClose,
  onPublish,
}: PublishPlatformSelectorProps) {
  const [platforms, setPlatforms] = useState<PublishPlatform[]>([
    { id: "all", name: "All", icon: null, checked: false },
    {
      id: "web",
      name: "Web",
      icon: <Globe className="w-4 h-4" />,
      checked: false,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: <Instagram className="w-4 h-4" />,
      checked: false,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      checked: false,
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: <Twitter className="w-4 h-4" />,
      checked: false,
    },
  ]);

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms((prevPlatforms) => {
      if (platformId === "all") {
        const newCheckedState = !prevPlatforms[0].checked;
        return prevPlatforms.map((platform) => ({
          ...platform,
          checked: newCheckedState,
        }));
      } else {
        return prevPlatforms.map((platform) => {
          if (platform.id === platformId) {
            return { ...platform, checked: !platform.checked };
          }
          return platform;
        });
      }
    });
  };

  const handlePublish = () => {
    const selectedPlatforms = platforms
      .filter((platform) => platform.checked)
      .map((platform) => platform.id);

    if (selectedPlatforms.length === 0) {
      return;
    }

    onPublish(selectedPlatforms);
    onClose();
  };

  const selectedCount = platforms.filter((platform) => platform.checked).length;

  if (!isOpen) return null;

  return (
    <Card className="bg-white  rounded-[12px] h-min !gap-2 shadow-lg border !w-[200px]  border-gray-200 p-2 ">
      <div className="space-y-3 px-4 py-2">
        {platforms.map((platform) => (
          <div key={platform.id} className="flex py-1 items-center space-x-3">
            <Checkbox
              id={platform.id}
              checked={platform.checked}
              onCheckedChange={() => handlePlatformToggle(platform.id)}
              className="data-[state=checked]:bg-green-600 h-4 w-4 data-[state=checked]:border-green-600"
            />
            <label
              htmlFor={platform.id}
              className="flex items-center space-x-2 text-sm font-semibold text-[#6A7282] cursor-pointer"
            >
              {platform.icon}
              <span>{platform.name}</span>
            </label>
          </div>
        ))}
      </div>

      <Button
        onClick={handlePublish}
        disabled={selectedCount === 0}
        className="flex-1 bg-[#008001] w-full hover:bg-[#008001] text-white"
      >
        <Send className="w-4 h-4 mr-2" />
        Publish
      </Button>
    </Card>
  );
}
