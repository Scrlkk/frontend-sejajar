import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-50/20 rounded-full blur-3xl" />
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
            404
          </h1>
          <h1 className="absolute inset-0 text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-red-800 to-red-600 select-none opacity-80">
            404
          </h1>
        </div>

        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
          <Search className="w-7 h-7 text-red-800/70" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Halaman tidak ditemukan
        </h2>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          Maaf, halaman yang kamu cari tidak tersedia atau mungkin sudah
          dipindahkan. Silakan kembali ke dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => navigate("/dashboard")}
            className="h-11 px-6 bg-red-800 hover:bg-red-900 text-white rounded-xl font-semibold text-sm gap-2 shadow-lg shadow-red-800/20 transition-all hover:shadow-xl hover:shadow-red-800/30 cursor-pointer"
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
          ERROR 404 — PAGE NOT FOUND
        </p>
      </div>
    </div>
  );
};
