import { useLocation, useNavigate } from "react-router-dom";
import { sidebarMenuItems, getSidebarGroupsForUser } from "@/components/shared/sidebarMenu";
import { Notification } from "@/components/shared/Notification";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, logout } = useAuth();

  const sidebarGroups = getSidebarGroupsForUser(user);
  const userMenuItems = sidebarGroups.flatMap((g) => g.items);
  const routeFallbackMap: Record<string, { title: string; subtitle: string }> = {
    "/profile": {
      title: "Profile",
      subtitle: "Manage your account settings and credentials",
    },
    "/pillars": {
      title: "Pillars & Content Categories",
      subtitle: "Manage your content pillars and categories to organize publishing objectives.",
    },
  };

  let currentPage =
    userMenuItems.find((item) => item.to === location.pathname) ||
    sidebarMenuItems.find((item) => item.to === location.pathname);

  if (!currentPage) {
    currentPage =
      userMenuItems.find(
        (item) => item.to !== "/" && location.pathname.startsWith(item.to)
      ) ||
      sidebarMenuItems.find(
        (item) => item.to !== "/" && location.pathname.startsWith(item.to)
      );
  }

  const fallback = routeFallbackMap[location.pathname];
  const pageTitle = fallback?.title ?? currentPage?.title ?? "Dashboard";
  const pageSubtitle =
    fallback?.subtitle ??
    currentPage?.subtitle ??
    "Welcome back — here's what's happening today";

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "U";

  const userName = user?.full_name ?? "User";
  const userRoleDisplay = user?.roles && user.roles.length > 0
    ? user.roles
        .map((r) => r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(", ")
    : user?.role
      ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "User";

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
                <span className="text-red-600 font-bold text-sm">{initials}</span>
              </div>
              <div className="min-w-0 text-left hidden sm:block">
                <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                  {userRoleDisplay}
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
              onClick={logout}
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
