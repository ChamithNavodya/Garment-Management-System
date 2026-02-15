"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  TaskSubmission,
  Employee,
  TaskType,
  CreateTaskSubmissionInput,
} from "@/types";
import {
  Plus,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import SubmissionForm from "@/components/tasks/SubmissionForm";
import SubmissionDetails from "@/components/tasks/SubmissionDetails";

export default function SubmissionsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);

  const { data, isLoading } = useQuery<{
    items: TaskSubmission[];
    total: number;
  }>({
    queryKey: ["submissions", page, search],
    queryFn: async () => {
      const response = await api.get("/tasks/submissions", {
        params: {
          page,
          limit: 8,
          employeeName: search,
        },
      });
      return response.data;
    },
  });

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await api.get("/employees");
      return response.data;
    },
  });

  const { data: taskTypes } = useQuery<TaskType[]>({
    queryKey: ["taskTypes"],
    queryFn: async () => {
      const response = await api.get("/tasks/types?status=ACTIVE");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTaskSubmissionInput) =>
      api.post("/tasks/submissions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setIsFormOpen(false);
    },
  });

  const totalPages = data ? Math.ceil(data.total / 10) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-gray-400">
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Submissions</h1>
          <p className="text-gray-500">
            View and manage grouped daily task records.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          Add Submission
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by employee name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
          />
        </div>
        <div className="p-2 text-gray-400 hover:text-blue-600 cursor-pointer">
          <Filter size={20} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data?.items.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-900">
                    {sub.employee?.firstName} {sub.employee?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sub.employee?.employeeType}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-blue-600">
                    LKR {Number(sub.totalAmount).toLocaleString()}
                  </p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(sub.submissionDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedSubmissionId(sub.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="View Breakdown"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {data?.items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing page {page} of {totalPages} ({data?.total} submissions)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white transition disabled:opacity-30"
              >
                <ChevronLeft size={18} className="text-gray-900" />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white transition disabled:opacity-30"
              >
                <ChevronRight size={18} className="text-gray-900" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isFormOpen && (
        <SubmissionForm
          employees={employees || []}
          taskTypes={taskTypes || []}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (val) => {
            await createMutation.mutateAsync(val);
          }}
        />
      )}

      {selectedSubmissionId && (
        <SubmissionDetails
          submissionId={selectedSubmissionId}
          onClose={() => setSelectedSubmissionId(null)}
        />
      )}
    </div>
  );
}
