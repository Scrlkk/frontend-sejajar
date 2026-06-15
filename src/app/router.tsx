import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { SuperadminPage } from "@/features/dashboard/pages/SuperadminPage";
import { UserRolePage } from "@/features/users/pages/UserRolePage";
import { SystemlogsPage } from "@/features/audit/pages/SystemlogsPage";
import { PublishPage } from "@/features/tasks/pages/PublishPage";
import { AdminSocialMediaPage } from "@/features/dashboard/pages/AdminSocialMediaPage";
import { CalendarPage } from "@/features/calendar/pages/CalendarPage";
import { NotFound } from "@/layouts/NotFound";
import { InternalError } from "@/layouts/InternalError";
import { SchedulesPage } from "@/features/tasks/pages/SchedulesPage";
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

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    errorElement: <InternalError />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },
  {
    element: <DashboardLayout />,
    errorElement: <InternalError />,
    children: [
      {
        path: "/dashboard",
        element: <SuperadminPage />,
      },
      {
        path: "/social-media",
        element: <AdminSocialMediaPage />,
      },
      {
        path: "/content-lead",
        element: <ContentLeadPage />,
      },
      {
        path: "/owner",
        element: <OwnerPage />,
      },
      {
        path: "/script-writer",
        element: <ScriptWriterPage />,
      },
      {
        path: "/content-editor",
        element: <ContentEditorPage />,
      },
      {
        path: "/contracts",
        element: <ContractPage />,
      },
      {
        path: "/tasks",
        element: <TasksPage />,
      },
      {
        path: "/schedules",
        element: <SchedulesPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/drafts",
        element: <DraftsPage />,
      },
      {
        path: "/uploads",
        element: <UploadsPage />,
      },
      {
        path: "/publish",
        element: <PublishPage />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/engagement",
        element: <EngagementPage />,
      },
      {
        path: "/user-roles",
        element: <UserRolePage />,
      },
      {
        path: "/system-logs",
        element: <SystemlogsPage />,
      },
    ],
  },
  {
    path: "/",
    errorElement: <InternalError />,
    element: (
      <a
        href="/login"
        className="w-full h-screen flex flex-col justify-center items-center bg-blue-600 text-white font-bold tracking-wider text-5xl"
      >
        Company Profile
      </a>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
