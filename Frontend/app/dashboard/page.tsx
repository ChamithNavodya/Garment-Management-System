"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardStats } from "@/types";
import {
  Users,
  ClipboardList,
  DollarSign,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Employee Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Employees</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Employees"
            value={stats?.employees.total || 0}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Permanent"
            value={stats?.employees.permanent || 0}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Temporary"
            value={stats?.employees.temporary || 0}
            icon={Users}
            color="bg-orange-500"
          />
          <StatCard
            title="Active"
            value={stats?.employees.active || 0}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Task Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Total Tasks"
            value={stats?.tasks.total || 0}
            icon={ClipboardList}
            color="bg-cyan-500"
          />
          <StatCard
            title="Tasks Today"
            value={stats?.tasks.today || 0}
            icon={ClipboardList}
            color="bg-indigo-500"
          />
        </div>
      </div>

      {/* Payroll Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Payroll</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard
            title="Payrolls This Month"
            value={stats?.payroll.thisMonth || 0}
            icon={DollarSign}
            color="bg-green-600"
          />
        </div>
      </div>
    </div>
  );
}
