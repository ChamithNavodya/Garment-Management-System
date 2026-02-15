"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TaskSubmission } from "@/types";
import { X, Clock, Calendar, User, DollarSign } from "lucide-react";

interface SubmissionDetailsProps {
  submissionId: string;
  onClose: () => void;
}

export default function SubmissionDetails({
  submissionId,
  onClose,
}: SubmissionDetailsProps) {
  const { data: submission, isLoading } = useQuery<TaskSubmission>({
    queryKey: ["submission", submissionId],
    queryFn: async () => {
      const response = await api.get(`/tasks/submissions/${submissionId}`);
      return response.data;
    },
  });

  if (isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col relative max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {submission?.employee?.firstName}{" "}
                {submission?.employee?.lastName}
              </h2>
              <p className="text-gray-500">
                {submission?.employee?.employeeType} Employee
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} />
              {new Date(submission?.submissionDate || "").toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              {new Date(submission?.submissionDate || "").toLocaleTimeString()}
            </div>
            <div className="col-span-2 flex items-center gap-2 text-blue-600 font-bold">
              <DollarSign size={18} />
              Total Earned: LKR{" "}
              {Number(submission?.totalAmount).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <h3 className="font-bold text-gray-900 mb-4">Task Breakdown</h3>
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-900">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase">
                    Task Type
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase text-center">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase text-right">
                    Price
                  </th>
                  <th className="px-6 py-3 text-xs font-bold uppercase text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-900">
                {submission?.tasks?.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {task.taskType?.name}
                      </p>
                      {task.notes && (
                        <p className="text-xs text-gray-500">{task.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900">
                      {task.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900">
                      LKR {Number(task.priceAtTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      LKR {Number(task.totalAmount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-bold border-t border-gray-100">
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-right text-gray-900"
                  >
                    Grand Total
                  </td>
                  <td className="px-6 py-4 text-right text-blue-600">
                    LKR {Number(submission?.totalAmount).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {submission?.notes && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <p className="text-xs font-bold text-yellow-800 uppercase mb-1">
                Submission Notes
              </p>
              <p className="text-sm text-yellow-900">{submission.notes}</p>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
