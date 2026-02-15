"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TaskType, TaskTypeCreateInput, TaskTypeUpdateInput } from "@/types";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import TaskTypeForm from "@/components/tasks/TaskTypeForm";

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | undefined>();

  const { data: tasks, isLoading } = useQuery<TaskType[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks/types");
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TaskTypeCreateInput) => api.post("/tasks/types", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskTypeUpdateInput }) =>
      api.patch(`/tasks/types/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsFormOpen(false);
      setEditingTask(undefined);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/types/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleEdit = (task: TaskType) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (
    data: TaskTypeCreateInput | TaskTypeUpdateInput,
  ) => {
    if (editingTask) {
      await updateMutation.mutateAsync({
        id: editingTask.id,
        data: data as TaskTypeUpdateInput,
      });
    } else {
      await createMutation.mutateAsync(data as TaskTypeCreateInput);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading task types...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Definitions</h1>
        <div className="flex gap-4">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Task Type
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Task Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Current Price
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
            {tasks?.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {task.name}
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {task.description || "-"}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  LKR {Number(task.price).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 text-gray-900">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this task type?",
                          )
                        ) {
                          deleteMutation.mutate(task.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {tasks?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No task types found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <TaskTypeForm
          taskType={editingTask}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(undefined);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
