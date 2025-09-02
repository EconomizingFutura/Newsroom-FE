import { cn } from "./ui/utils";

type StatusBadgeProps = {
  label: string;
  active?: boolean;
  activeClass?: string;
  inactiveClass?: string;
};

export function StatusBadge({
  label,
  active = false,
  activeClass,
  inactiveClass,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-[12px] py-[4px] text-sm rounded-lg border transition-colors",
        active ? activeClass : inactiveClass
      )}
    >
      {label}
    </span>
  );
}
