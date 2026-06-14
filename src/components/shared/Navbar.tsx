import { Bell, Settings as SettingsIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { sidebarMenuItems } from "@/components/shared/sidebarMenu";

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
        <p className="text-sm text-gray-600">
          {pageSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div> */}

        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
        </button>

        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <SettingsIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
