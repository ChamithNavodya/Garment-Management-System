"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Payroll } from "@/types";
import { DollarSign, FileText, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: payrolls, isLoading } = useQuery<Payroll[]>({
    queryKey: ["payrolls", month, year],
    queryFn: async () => {
      const response = await api.get("/payroll", { params: { month, year } });
      return response.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => api.post("/payroll/generate", { month, year }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      alert("Payroll generated successfully");
    },
    onError: (err: unknown) => {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        alert(
          axiosError.response?.data?.message || "Failed to generate payroll",
        );
      } else {
        alert("An unexpected error occurred during payroll generation");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading payroll data...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
        <div className="flex items-center gap-4">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            <DollarSign size={20} />
            {generateMutation.isPending ? "Generating..." : "Generate Payroll"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Net Salary
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payrolls?.map((payroll) => (
              <tr key={payroll.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">
                    {payroll.employee?.firstName} {payroll.employee?.lastName}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payroll.employeeType}
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {payroll.netSalary.toLocaleString("en-LK", {
                    style: "currency",
                    currency: "LKR",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      payroll.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : payroll.status === "APPROVED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {payroll.status === "PAID" ? (
                      <CheckCircle size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    {payroll.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 transition">
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {payrolls?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No payroll records found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
