import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64x bg-white border-r border-gray-200 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <Navbar />
        </header>
        <main className="bg-gray-100 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
