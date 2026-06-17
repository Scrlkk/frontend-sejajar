import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconBorderColor?: string;
  iconTextColor?: string;
  cancelText?: string;
  confirmText?: string;
  confirmBtnClassName?: string;
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon = <Trash2 className="h-6 w-6" />,
  iconBgColor = "bg-red-50",
  iconBorderColor = "border-red-150",
  iconTextColor = "text-red-800",
  cancelText = "Batal",
  confirmText = "Hapus",
  confirmBtnClassName = "bg-red-800 hover:bg-red-900 text-white",
}: DeleteModalProps) {
  // Local state to preserve text content during dialog fade-out transition
  const [prevTitle, setPrevTitle] = useState(title);
  const [prevDescription, setPrevDescription] = useState(description);
  const [displayTitle, setDisplayTitle] = useState(title);
  const [displayDescription, setDisplayDescription] = useState(description);

  if (title !== prevTitle) {
    setPrevTitle(title);
    if (title) {
      setDisplayTitle(title);
    }
  }

  if (description !== prevDescription) {
    setPrevDescription(description);
    if (description) {
      setDisplayDescription(description);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-95 bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 outline-none overflow-hidden">
        {/* Ambient background glow accent */}
        <div
          className={`absolute -top-12 -right-12 w-28 h-28 rounded-full filter blur-2xl opacity-25 ${iconBgColor}`}
        />

        <div className="flex flex-col items-center text-center space-y-4 pt-3 pb-1 relative z-10">
          {/* Animated double-ring icon container */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing outer ring */}
            <div
              className={`absolute inset-0 h-16 w-16 -m-2 rounded-full opacity-30 animate-ping ${iconBgColor}`}
              style={{ animationDuration: "3s" }}
            />
            {/* Inner icon circle */}
            <div
              className={`h-12 w-12 rounded-full ${iconBgColor} flex items-center justify-center border ${iconBorderColor} ${iconTextColor} shadow-md relative z-10 transition-transform duration-300 hover:scale-110`}
            >
              {icon}
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight px-1">
              {displayTitle}
            </h3>
            <div className="text-xs text-gray-500 font-medium px-2 leading-relaxed max-w-xs">
              {displayDescription}
            </div>
          </div>
        </div>

        {/* Action buttons with premium layouts */}
        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-gray-50 relative z-10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer h-10 shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl ${confirmBtnClassName} font-semibold transition-all text-xs cursor-pointer shadow-sm h-10 hover:scale-[1.01] active:scale-[0.99]`}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
