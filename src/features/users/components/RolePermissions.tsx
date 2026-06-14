import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface RolePermissionItem {
  id: string | number;
  roleName: string;
  userCount: number;
  roleBg: string;
  permissions: string[];
}

interface RolePermissionsProps {
  roles: RolePermissionItem[];
  title?: string;
  subtitle?: string;
  alertText?: string;
}

export function RolePermissions({
  roles,
  title = "Role Permissions",
  subtitle = "Menu access matrix per role",
  alertText = "Access boundaries are enforced per role to prevent overlap. Super Admin manages users and roles only — operational menus are reserved for Owner and team roles.",
}: RolePermissionsProps) {
  return (
    <Card className="w-full bg-white rounded-xl border-gray-200 outline outline-gray-300/40 shadow-lg p-6 space-y-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 space-y-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
        <span className="text-sm text-gray-400 font-medium">{subtitle}</span>
      </CardHeader>

      <CardContent className="p-0 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="rounded-xl border border-gray-200 outline outline-gray-300/40 shadow-sm p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={`${role.roleBg} shadow-none rounded-lg px-2.5 py-1 font-bold text-xs border-none`}
                >
                  {role.roleName}
                </Badge>
                <span className="text-xs font-semibold text-gray-500">
                  {role.userCount} users
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {role.permissions.map((permission, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-none font-normal text-xs rounded-lg px-2.5 py-1"
                  >
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {alertText && (
        <div className="flex items-start border-l-4 border-red-logo bg-red-50/50 rounded-r-xl p-4 text-sm text-gray-600 leading-relaxed">
          <p>{alertText}</p>
        </div>
      )}
    </Card>
  );
}
