import { DashboardLayout } from "@/components/dashboard-layout";
import { Toaster } from "@/components/ui/toast";
import { ProtectedRoute } from "@/contexts/protected-route";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children} <Toaster /></DashboardLayout>;
    </ProtectedRoute>
  );
}
