import { DashboardLayout } from "@/components/dashboard-layout";
import { ProtectedRoute } from "@/contexts/protected-route";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>;
    </ProtectedRoute>
  );
}
