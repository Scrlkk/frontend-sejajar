import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InternalError = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const isRouteError = isRouteErrorResponse(error);
  const statusCode = isRouteError ? error.status : 500;
  const statusText = isRouteError ? error.statusText : "Internal Server Error";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-100/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-50/20 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <div className="relative mb-6">
          <h1 className="text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-gray-200 to-gray-300 select-none">
            {statusCode}
          </h1>
          <h1 className="absolute inset-0 text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-amber-700 to-red-700 select-none opacity-80">
            {statusCode}
          </h1>
        </div>

        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shadow-sm">
          <AlertTriangle className="w-7 h-7 text-amber-700/70" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Terjadi Kesalahan
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4 max-w-md mx-auto">
          Maaf, terjadi kesalahan pada sistem. Silakan coba muat ulang halaman
          atau kembali ke dashboard.
        </p>

        {import.meta.env.DEV && !!error && (
          <div className="mb-8 mx-auto max-w-md rounded-xl border border-red-100 bg-red-50/50 p-4 text-left">
            <p className="text-xs font-semibold text-red-800/70 uppercase tracking-wider mb-1">
              Detail Error
            </p>
            <p className="text-sm text-red-700 font-mono break-all leading-relaxed">
              {isRouteError
                ? `${statusCode} — ${statusText}`
                : error instanceof Error
                  ? error.message
                  : String(error)}
            </p>
          </div>
        )}

        {!import.meta.env.DEV && <div className="mb-10" />}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="h-11 px-6 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-sm gap-2 shadow-lg shadow-amber-700/20 transition-all hover:shadow-xl hover:shadow-amber-700/30 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Muat Ulang
          </Button>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="h-11 px-6 text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50 rounded-xl font-medium text-sm gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Ke Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-11 px-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium text-sm gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>

        <p className="mt-16 text-xs text-gray-300 font-medium tracking-wide">
          ERROR {statusCode} — {statusText.toUpperCase()}
        </p>
      </div>
    </div>
  );
};
