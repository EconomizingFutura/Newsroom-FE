import type React from "react";
import { FileText, Search } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  const buttonBase =
    "flex-1 h-11 font-medium rounded-xl transition-all duration-200";

  const buttonVariants: Record<string, string> = {
    primary: `${buttonBase} bg-blue-600 text-white shadow hover:bg-blue-700 hover:shadow-md`,
    secondary: `${buttonBase} bg-gray-200 text-gray-900 hover:bg-gray-300`,
    outline: `${buttonBase} border border-gray-300 bg-white hover:bg-gray-50`,
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-white to-gray-50 ${className}`}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[320px]">
        {/* Icon */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 to-blue-100/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 backdrop-blur-sm border border-gray-200 group-hover:scale-105 transition-transform duration-300">
            {icon || <FileText className="h-10 w-10 text-gray-400" />}
          </div>
        </div>

        {/* Title & description */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h3>
          <p className="text-gray-500 max-w-md leading-relaxed text-[15px]">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="hidden flex-col sm:flex-row gap-3 w-full max-w-sm">
          {action && (
            <button
              onClick={action.onClick}
              className={buttonVariants[action.variant || "primary"]}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`${buttonVariants.outline} bg-white/70 backdrop-blur-sm`}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Example usage
export function PendingReviewEmptyState() {
  return (
    <EmptyState
      icon={<Search className="h-10 w-10 text-blue-500/70" />}
      title="No pending reviews"
      description="All submissions have been reviewed. New submissions will appear here when they're ready for review."
      action={{
        label: "Refresh",
        onClick: () => window.location.reload(),
        variant: "outline",
      }}
    />
  );
}
