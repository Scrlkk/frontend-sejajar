import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ApiErrorFallbackProps {
  /** Pesan error yang ditampilkan ke user */
  message?: string;
  /** Callback untuk retry/muat ulang data */
  onRetry?: () => void;
  /** Judul error, default: "Gagal Memuat Data" */
  title?: string;
  /** Tampilkan dalam mode compact (tanpa border/background) */
  compact?: boolean;
}

export const ApiErrorFallback = ({
  message = "Terjadi kesalahan saat mengambil data. Silakan coba lagi.",
  onRetry,
  title = "Gagal Memuat Data",
  compact = false,
}: ApiErrorFallbackProps) => {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
        <p className="text-sm text-gray-500 mb-4 max-w-sm">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg text-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Coba Lagi
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full py-16 px-4">
      <div className="relative max-w-md w-full text-center">
        {/* Decorative glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl" />
        </div>

        {/* Content card */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow-sm">
          {/* Icon */}
          <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
            {message}
          </p>

          {/* Retry button */}
          {onRetry && (
            <Button
              onClick={onRetry}
              className="h-10 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold text-sm gap-2 shadow-md shadow-amber-600/20 transition-all hover:shadow-lg hover:shadow-amber-600/30 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
