import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/components/ui/utils";
import { Popover, PopoverContent } from "@radix-ui/react-popover";
import {
  CalendarIcon,
  Facebook,
  Globe,
  Instagram,
  Twitter,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface PlatformIconProps {
  name: string;
  color?: string;
  size?: number;
}

export const PlatformIcon = ({
  name,
  color = "#2C3E50",
  size = 20,
}: PlatformIconProps) => {
  switch (name) {
    case "Web":
      return <Globe color={color} size={size} />;
    case "Instagram":
      return <Instagram color={color} size={size} />;
    case "Twitter":
      return <Twitter color={color} size={size} />;
    case "Facebook":
      return <Facebook color={color} size={size} />;
    default:
      return null;
  }
};

interface DatePickerProps {
  value?: string;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePickerComponent({
  value,
  onChange,
  placeholder = "Select Date",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const dateValue = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center text-[#262A33] bg-[#fffdf7] border rounded-lg h-10 justify-between px-2 border-[#262A33] w-full hover:bg-[#F7FAFF]",
            !value && "text-[#262A33] font-semibold",
            className
          )}
          disabled={disabled}
        >
          <span className="text-sm font-medium !text-[#03101F]">
            {dateValue ? format(dateValue, "PPP") : placeholder}
          </span>
          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          disabled={{ before: new Date() }}
          className="rounded-lg z-50"
          onSelect={(date) => {
            onChange?.(date ? format(date, "yyyy-MM-dd") : "");
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
