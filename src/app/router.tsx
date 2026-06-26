import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { SuperadminPage } from "@/features/dashboard/pages/SuperadminPage";
import { UserRolePage } from "@/features/users/pages/UserRolePage";
import { ProfilePage } from "@/features/users/pages/ProfilePage";
import { SystemlogsPage } from "@/features/audit/pages/SystemlogsPage";
import { PublishPage } from "@/features/tasks/pages/PublishPage";
import { AdminSocialMediaPage } from "@/features/dashboard/pages/AdminSocialMediaPage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";
import { NotFound } from "@/layouts/NotFound";
import { InternalError } from "@/layouts/InternalError";
import { AnalyticsPage } from "@/features/analytics/pages/AnalyticsPage";
import { EngagementPage } from "@/features/analytics/pages/EngagementPage";
import { ContentLeadPage } from "@/features/dashboard/pages/ContentLeadPage";
import { ContractPage } from "@/features/contracts/pages/ContractPage";
import { TasksPage } from "@/features/tasks/pages/TasksPage";
import { OwnerPage } from "@/features/dashboard/pages/OwnerPage";
import { ScriptWriterPage } from "@/features/dashboard/pages/ScriptWriterPage";
import { ContentEditorPage } from "@/features/dashboard/pages/ContentEditorPage";
import { UploadsPage } from "@/features/tasks/pages/UploadsPage";
import { DraftsPage } from "@/features/tasks/pages/DraftsPage";
import { ContractContentPage } from "@/features/contracts/pages/ContractContentPage";
import { ClientsPage } from "@/features/clients/pages/ClientsPage";
import { PillarsPage } from "@/features/pillars/pages/PillarsPage";

// Route guard wrappers
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { GuestRoute } from "@/routes/GuestRoute";
import { RoleRoute } from "@/routes/RoleRoute";

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        errorElement: <InternalError />,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        errorElement: <InternalError />,
        children: [
          // --- Role-specific Dashboards ---
          {
            element: <RoleRoute allowedRoles={["superadmin"]} />,
            children: [
              {
                path: "/dashboard/superadmin",
                element: <SuperadminPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["admin_social_media"]} />,
            children: [
              {
                path: "/dashboard/social-media",
                element: <AdminSocialMediaPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["content_lead"]} />,
            children: [
              {
                path: "/dashboard/content-lead",
                element: <ContentLeadPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["owner"]} />,
            children: [
              {
                path: "/dashboard/owner",
                element: <OwnerPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["script_writer"]} />,
            children: [
              {
                path: "/dashboard/script-writer",
                element: <ScriptWriterPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["content_editor"]} />,
            children: [
              {
                path: "/dashboard/content-editor",
                element: <ContentEditorPage />,
              },
            ],
          },

          // --- Shared/Authenticated Pages ---
          {
            element: <RoleRoute allowedRoles={["owner"]} />,
            children: [
              {
                path: "/clients",
                element: <ClientsPage />,
              },
              {
                path: "/analytics",
                element: <AnalyticsPage />,
              },
              {
                path: "/employee",
                element: <UserRolePage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["owner", "content_lead"]} />,
            children: [
              {
                path: "/contracts",
                element: <ContractPage />,
              },
              {
                path: "/contracts/:id",
                element: <ContractContentPage />,
              },
              {
                path: "/metadata",
                element: <PillarsPage />,
              },
            ],
          },
          {
            element: (
              <RoleRoute
                allowedRoles={[
                  "content_lead",
                  "content_editor",
                  "script_writer",
                  "admin_social_media",
                ]}
              />
            ),
            children: [
              {
                path: "/tasks",
                element: <TasksPage />,
              },
            ],
          },
          {
            element: (
              <RoleRoute
                allowedRoles={[
                  "owner",
                  "content_lead",
                  "content_editor",
                  "script_writer",
                  "admin_social_media",
                ]}
              />
            ),
            children: [
              {
                path: "/calendar",
                element: <CalendarPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["script_writer"]} />,
            children: [
              {
                path: "/drafts",
                element: <DraftsPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["content_editor"]} />,
            children: [
              {
                path: "/uploads",
                element: <UploadsPage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["admin_social_media"]} />,
            children: [
              {
                path: "/publish",
                element: <PublishPage />,
              },
              {
                path: "/engagement",
                element: <EngagementPage />,
              },
            ],
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },

          // --- Restricted Pages ---
          {
            element: <RoleRoute allowedRoles={["superadmin", "owner"]} />,
            children: [
              {
                path: "/user-roles",
                element: <UserRolePage />,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["superadmin"]} />,
            children: [
              {
                path: "/system-logs",
                element: <SystemlogsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/",
    errorElement: <InternalError />,
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
