import React from "react";
import { contentHeader } from "./contentHeader";
import { cn } from "@/components/ui/utils";

export type HeaderKey = keyof typeof contentHeader;

interface HeaderIconProps {
  name: HeaderKey;
  className?: string;
}

export const HeaderIcon: React.FC<HeaderIconProps> = ({ name, className }) => {
  const Icon = contentHeader[name];
  return <Icon className={cn("w-6 h-6", className)} />;
};
