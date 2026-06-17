import { useLocation } from "react-router-dom";
import { sidebarMenuItems } from "@/components/shared/sidebarMenu";
import { Notification } from "@/components/shared/Notification";

export const Navbar = () => {
  const location = useLocation();
  const currentPage = sidebarMenuItems.find(
    (item) => item.to === location.pathname,
  );
  const pageTitle = currentPage?.title ?? "Dashboard";
  const pageSubtitle =
    currentPage?.subtitle ?? "Welcome back — here's what's happening today";

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{pageTitle}</h2>
        <p className="text-sm text-gray-600">{pageSubtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <Notification />

        <hr className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-red-600 font-bold text-sm">AR</span>
          </div>
          <div className="min-w-0 text-left hidden sm:block">
            <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
              Asep Racing
            </p>
            <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
              Owner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
