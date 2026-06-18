import {
  usersData,
  usersCards,
  rolePermissionsData,
} from "@/data/mockData";
import { UserManagement } from "@/features/users/components/UserMangement";
import { CardDashboard } from "@/features/dashboard/components/CardDashboard";
import { RolePermissions } from "@/features/users/components/RolePermissions";

export const UserRolePage = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {usersCards.map((card) => (
          <CardDashboard key={card.title} {...card} />
        ))}
      </div>
      <UserManagement users={usersData} />
      <RolePermissions roles={rolePermissionsData} />
    </div>
  );
};
