import React from "react";
import { Loader2 } from "lucide-react";

export const PageLoader: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50/50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Page...
        </span>
      </div>
    </div>
  );
};
