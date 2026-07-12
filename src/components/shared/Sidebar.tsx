import { LayoutPanelLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSidebarGroupsForUser } from "@/components/shared/sidebarMenu";
import { useAuth } from "@/hooks/useAuth";

const preloadMap: Record<string, () => void> = {
  "/dashboard/superadmin": () =>
    import("@/features/dashboard/pages/SuperadminPage"),
  "/dashboard/social-media": () =>
    import("@/features/dashboard/pages/AdminSocialMediaPage"),
  "/dashboard/content-lead": () =>
    import("@/features/dashboard/pages/ContentLeadPage"),
  "/dashboard/owner": () => import("@/features/dashboard/pages/OwnerPage"),
  "/dashboard/script-writer": () =>
    import("@/features/dashboard/pages/ScriptWriterPage"),
  "/dashboard/content-editor": () =>
    import("@/features/dashboard/pages/ContentEditorPage"),
  "/contracts": () => import("@/features/contracts/pages/ContractPage"),
  "/clients": () => import("@/features/clients/pages/ClientsPage"),
  "/tasks": () => import("@/features/tasks/pages/TasksPage"),
  "/calendar": () => import("@/features/calendar/pages/CalendarPage"),
  "/drafts": () => import("@/features/tasks/pages/DraftsPage"),
  "/uploads": () => import("@/features/tasks/pages/UploadsPage"),
  "/publish": () => import("@/features/tasks/pages/PublishPage"),
  "/analytics": () => import("@/features/analytics/pages/AnalyticsPage"),
  "/profile": () => import("@/features/users/pages/ProfilePage"),
  "/system-logs": () => import("@/features/audit/pages/SystemlogsPage"),
  "/user-roles": () => import("@/features/users/pages/UserRolePage"),
  "/pillars": () => import("@/features/pillars/pages/PillarsPage"),
};

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const sidebarGroups = getSidebarGroupsForUser(user);

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

      <nav className="flex-1 px-4 overflow-y-auto space-y-4">
        {sidebarGroups.map((group) => (
          <div key={group.group}>
            <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.to ||
                  (item.to !== "/" &&
                    location.pathname.startsWith(`${item.to}/`));

                return (
                  <button
                    key={item.to}
                    onClick={() => navigate(item.to)}
                    onMouseEnter={() => preloadMap[item.to]?.()}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition dynamic-classes focus-none outline-none
                      ${
                        isActive
                          ? "bg-red-50 text-red-600 font-normal"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};
