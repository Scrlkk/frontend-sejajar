import { Outlet } from "react-router-dom";
import { LoginLogo } from "@/components/shared/LoginLogo";

export const AuthLayout = () => {
  return (
    <div className="h-screen w-full bg-linear-to-tr/oklch from-red-600 to-red-300">
      <div className="w-full h-full flex justify-center gap-4 px-12 py-8">
        <div className="w-xl bg-red-logo py-8 px-4 rounded-tl-4xl rounded-br-4xl flex justify-center items-center shadow-2xl">
          <LoginLogo className="text-white" />
        </div>
        <div className="w-lg bg-white-logo py-8 px-4 rounded-tr-4xl rounded-bl-4xl shadow-2xl border-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
