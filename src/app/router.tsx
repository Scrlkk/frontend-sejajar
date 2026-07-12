import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { PageLoader } from "@/components/shared/PageLoader";

// Layouts and Routes (synchronous)
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { GuestRoute } from "@/routes/GuestRoute";
import { RoleRoute } from "@/routes/RoleRoute";
import { NotFound } from "@/layouts/NotFound";
import { InternalError } from "@/layouts/InternalError";

// Lazy Loaded Pages
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const SuperadminPage = lazy(() => import("@/features/dashboard/pages/SuperadminPage").then(m => ({ default: m.SuperadminPage })));
const UserRolePage = lazy(() => import("@/features/users/pages/UserRolePage").then(m => ({ default: m.UserRolePage })));
const ProfilePage = lazy(() => import("@/features/users/pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const SystemlogsPage = lazy(() => import("@/features/audit/pages/SystemlogsPage").then(m => ({ default: m.SystemlogsPage })));
const PublishPage = lazy(() => import("@/features/tasks/pages/PublishPage").then(m => ({ default: m.PublishPage })));
const AdminSocialMediaPage = lazy(() => import("@/features/dashboard/pages/AdminSocialMediaPage").then(m => ({ default: m.AdminSocialMediaPage })));
const CalendarPage = lazy(() => import("@/features/calendar/pages/CalendarPage").then(m => ({ default: m.CalendarPage })));
const AnalyticsPage = lazy(() => import("@/features/analytics/pages/AnalyticsPage").then(m => ({ default: m.AnalyticsPage })));
const EngagementPage = lazy(() => import("@/features/analytics/pages/EngagementPage").then(m => ({ default: m.EngagementPage })));
const ContentLeadPage = lazy(() => import("@/features/dashboard/pages/ContentLeadPage").then(m => ({ default: m.ContentLeadPage })));
const ContractPage = lazy(() => import("@/features/contracts/pages/ContractPage").then(m => ({ default: m.ContractPage })));
const TasksPage = lazy(() => import("@/features/tasks/pages/TasksPage").then(m => ({ default: m.TasksPage })));
const OwnerPage = lazy(() => import("@/features/dashboard/pages/OwnerPage").then(m => ({ default: m.OwnerPage })));
const ScriptWriterPage = lazy(() => import("@/features/dashboard/pages/ScriptWriterPage").then(m => ({ default: m.ScriptWriterPage })));
const ContentEditorPage = lazy(() => import("@/features/dashboard/pages/ContentEditorPage").then(m => ({ default: m.ContentEditorPage })));
const UploadsPage = lazy(() => import("@/features/tasks/pages/UploadsPage").then(m => ({ default: m.UploadsPage })));
const DraftsPage = lazy(() => import("@/features/tasks/pages/DraftsPage").then(m => ({ default: m.DraftsPage })));
const ContractContentPage = lazy(() => import("@/features/contracts/pages/ContractContentPage").then(m => ({ default: m.ContractContentPage })));
const ClientsPage = lazy(() => import("@/features/clients/pages/ClientsPage").then(m => ({ default: m.ClientsPage })));
const PillarsPage = lazy(() => import("@/features/pillars/pages/PillarsPage").then(m => ({ default: m.PillarsPage })));

// Helper to wrap pages with Suspense & PageLoader
const lazyLoad = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        errorElement: <InternalError />,
        children: [
          { path: "/login", element: lazyLoad(LoginPage) },
          { path: "/forgot-password", element: lazyLoad(ForgotPasswordPage) },
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
          {
            element: <RoleRoute allowedRoles={["superadmin"]} />,
            children: [
              {
                path: "/dashboard/superadmin",
                element: lazyLoad(SuperadminPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["admin_social_media"]} />,
            children: [
              {
                path: "/dashboard/social-media",
                element: lazyLoad(AdminSocialMediaPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["content_lead"]} />,
            children: [
              {
                path: "/dashboard/content-lead",
                element: lazyLoad(ContentLeadPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["owner"]} />,
            children: [
              {
                path: "/dashboard/owner",
                element: lazyLoad(OwnerPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["script_writer"]} />,
            children: [
              {
                path: "/dashboard/script-writer",
                element: lazyLoad(ScriptWriterPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["content_editor"]} />,
            children: [
              {
                path: "/dashboard/content-editor",
                element: lazyLoad(ContentEditorPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["owner"]} />,
            children: [
              {
                path: "/clients",
                element: lazyLoad(ClientsPage),
              },
              {
                path: "/analytics",
                element: lazyLoad(AnalyticsPage),
              },
              {
                path: "/employee",
                element: lazyLoad(UserRolePage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["owner", "content_lead"]} />,
            children: [
              {
                path: "/contracts",
                element: lazyLoad(ContractPage),
              },
              {
                path: "/contracts/:id",
                element: lazyLoad(ContractContentPage),
              },
              {
                path: "/metadata",
                element: lazyLoad(PillarsPage),
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
                element: lazyLoad(TasksPage),
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
                element: lazyLoad(CalendarPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["script_writer"]} />,
            children: [
              {
                path: "/drafts",
                element: lazyLoad(DraftsPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["content_editor"]} />,
            children: [
              {
                path: "/uploads",
                element: lazyLoad(UploadsPage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["admin_social_media"]} />,
            children: [
              {
                path: "/publish",
                element: lazyLoad(PublishPage),
              },
              {
                path: "/engagement",
                element: lazyLoad(EngagementPage),
              },
            ],
          },
          {
            path: "/profile",
            element: lazyLoad(ProfilePage),
          },
          {
            element: <RoleRoute allowedRoles={["superadmin", "owner"]} />,
            children: [
              {
                path: "/user-roles",
                element: lazyLoad(UserRolePage),
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["superadmin"]} />,
            children: [
              {
                path: "/system-logs",
                element: lazyLoad(SystemlogsPage),
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

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

