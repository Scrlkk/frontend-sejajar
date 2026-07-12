import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { Toaster } from "react-hot-toast";
import { AppRouter } from "@/app/router";
import { AuthProvider } from "@/contexts/AuthProvider";
export const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
};
