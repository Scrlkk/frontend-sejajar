import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { AuthProvider } from "@/contexts/AuthProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";

export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" reverseOrder={false} />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
