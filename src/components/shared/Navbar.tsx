import { useLocation, useNavigate } from "react-router-dom";
import { sidebarMenuItems } from "@/components/shared/sidebarMenu";
import { Notification } from "@/components/shared/Notification";
import { LogOut, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
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

        <hr className="h-8 w-px bg-gray-300" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50/60 p-1.5 rounded-lg transition-colors select-none">
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
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 p-1 shadow-lg rounded-xl z-50">
            <DropdownMenuLabel className="text-[10px] font-semibold text-gray-400 px-2 py-1.5 uppercase tracking-wider">My Account</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigate("/profile")}
              className="rounded-lg text-xs font-semibold text-gray-700 focus:bg-gray-50 focus:text-gray-900 cursor-pointer flex items-center gap-2 px-2 py-2"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-gray-100" />
            <DropdownMenuItem
              onClick={() => navigate("/login")}
              className="rounded-lg text-xs font-semibold text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer flex items-center gap-2 px-2 py-2"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
