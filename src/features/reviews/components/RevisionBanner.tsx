import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RevisionBannerProps {
  title?: string;
  description?: string;
  onReUpload?: () => void;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

export function RevisionBanner({
  title,
  description,
  onReUpload,
  buttonText,
  buttonIcon,
}: RevisionBannerProps) {
  return (
    <div className="w-full bg-red-50/40 border border-red-400 rounded-2xl p-4 flex flex-row items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="h-10 w-10 rounded-xl bg-red-100/60 text-red-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5 stroke-[2.5]" />
        </div>

        <div className="flex flex-col min-w-0 space-y-0.5">
          <h4 className="font-semibold text-red-900 text-sm md:text-base truncate leading-snug">
            {title}
          </h4>
          <p className="text-xs md:text-sm font-medium text-red-800/80 leading-normal wrap-break-word">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Button
          variant="outline"
          onClick={onReUpload}
          className="bg-red-50 text-red-600 border-red-300 hover:border-red-logo hover:bg-red-logo hover:text-white rounded-xl font-medium text-xs md:text-sm h-10 px-4 flex items-center gap-2 transition-all cursor-pointer shadow-none"
        >
          {buttonIcon}
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
