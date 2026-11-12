import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
