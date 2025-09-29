import React from "react";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "../ui/utils";
import "./agency-card.css"; // ⬅️ add this

type Agency = {
  id: string;
  name: string;
  url: string;
  domain: string;
  color: string;
};

type AgencyCardProps = {
  agency: Agency;
  index?: number;
};

export const AgencyCard: React.FC<AgencyCardProps> = ({
  agency,
  index = 0,
}) => {
  const style: React.CSSProperties = {
    animationDelay: `${Math.min(index, 12) * 60}ms`,
  };

  const favicon = `https://www.google.com/s2/favicons?sz=64&domain=${agency.domain}`;

  return (
    <a
      href={agency.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group focus:outline-none"
    >
      <Card
        style={style}
        className={cn(
          "agency-card", // ⬅️ new: base hook for CSS
          "agency-card-anim", // ⬅️ new: animation class
          // container
          "relative overflow-hidden rounded-xl p-3 transition-all",
          "border-muted/60 bg-background",
          // hover/active
          "hover:shadow-md hover:shadow-emerald-100/60 hover:-translate-y-0.5",
          "active:scale-[0.99]",
          // focus ring
          "focus-visible:ring-2 focus-visible:ring-emerald-500"
        )}
      >
        {/* Glow accent */}
        <div
          className={cn(
            "agency-card__glow", // ⬅️ new: controlled by CSS above
            agency.color // keep your Tailwind brand hint
          )}
          aria-hidden="true"
        />

        <div className="flex items-center gap-3">
          <div
            className={cn(
              "relative h-9 w-9 shrink-0 rounded-lg ring-1 ring-inset ring-black/5",
              "bg-white"
            )}
          >
            <img
              src={favicon || "/placeholder.svg"}
              alt={`${agency.name} icon`}
              className="object-contain p-1.5"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-6">
              {agency.name}
            </p>
            <p className="truncate text-[11px]">
              {agency.domain}
            </p>
          </div>

          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-emerald-600" />
        </div>
      </Card>
    </a>
  );
};
