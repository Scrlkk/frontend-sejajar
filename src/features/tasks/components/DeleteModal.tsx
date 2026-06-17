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
}

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
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
      <DialogContent className="sm:max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 outline-none">
        <div className="flex flex-col items-center text-center space-y-3.5 pt-2">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center border border-red-150 text-red-800 shadow-sm animate-bounce">
            <Trash2 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">{displayTitle}</h3>
            <div className="text-xs text-gray-500 font-medium max-w-xs leading-relaxed">
              {displayDescription}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 px-5 text-xs font-semibold cursor-pointer h-9 shadow-sm"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-800 hover:bg-red-900 text-white font-semibold px-5 transition-all text-xs cursor-pointer shadow-sm h-9"
          >
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
