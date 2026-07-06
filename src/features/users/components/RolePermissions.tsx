import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface RolePermissionItem {
  id: string | number;
  roleName: string;
  userCount: number;
  roleBg: string;
  permissions: string[];
  description?: string;
}

interface RolePermissionsProps {
  roles: RolePermissionItem[];
  title?: string;
  subtitle?: string;
  alertText?: string;
}

export function RolePermissions({
  roles,
  title = "Role Access & Responsibilities",
  subtitle = "Overview of access boundaries and key responsibilities for system roles",
  alertText = "The access matrix above is static (read-only) to visualize default system roles and permissions. Access boundaries are enforced at the system level to prevent overlapping privileges.",
}: RolePermissionsProps) {
  return (
    <Card className="w-full bg-white rounded-xl border-gray-200 outline outline-gray-300/40 shadow-lg p-6 space-y-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-0 space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-200 lg:min-w-full divide-y divide-gray-100 border border-gray-200/80 rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50/75 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-3">Role</div>
            <div className="col-span-5">Key Responsibilities</div>
            <div className="col-span-4">Accessible Menus</div>
          </div>

          <div className="divide-y divide-gray-100 bg-white">
            {roles.map((role) => (
              <div
                key={role.id}
                className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors"
              >
                <div className="col-span-3 flex items-center pr-4">
                  <Badge
                    variant="secondary"
                    className={`${role.roleBg} shadow-none rounded-lg px-2.5 py-0.5 font-bold text-xs border-none`}
                  >
                    {role.roleName}
                  </Badge>
                </div>

                <div className="col-span-5 text-sm text-gray-600 font-normal leading-relaxed pr-6">
                  {role.description || "-"}
                </div>

                <div className="col-span-4 text-xs text-gray-600 font-semibold leading-relaxed">
                  {role.permissions.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {alertText && (
        <div className="flex items-start border-l-4 border-amber-500 bg-amber-50/30 rounded-r-xl p-4 text-xs text-gray-600 leading-relaxed">
          <p>{alertText}</p>
        </div>
      )}
    </Card>
  );
}

