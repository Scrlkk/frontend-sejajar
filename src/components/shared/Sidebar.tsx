import { LayoutPanelLeft, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarMenuItems } from "@/components/shared/sidebarMenu";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-logo rounded-lg">
            <LayoutPanelLeft className="fill-white stroke-white " />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">Sejajar Creative</p>
            <p className="text-sm text-gray-500 truncate">Content Studio</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {sidebarMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(`${item.to}/`));

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition dynamic-classes focus-none outline-none
                ${
                  isActive
                    ? "bg-red-50 text-red-600 font-normal"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-10 mb-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            navigate("/login");
          }}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition font-medium cursor-pointer"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
