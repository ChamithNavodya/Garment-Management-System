"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TaskType, TaskTypeCreateInput } from "@/types";
import { X } from "lucide-react";

const taskTypeSchema = z.object({
  name: z.string().min(2, "Task name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

type TaskTypeFormValues = z.infer<typeof taskTypeSchema>;

interface TaskTypeFormProps {
  taskType?: TaskType;
  onClose: () => void;
  onSubmit: (data: TaskTypeCreateInput) => Promise<void>;
}

export default function TaskTypeForm({
  taskType,
  onClose,
  onSubmit,
}: TaskTypeFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskTypeFormValues>({
    resolver: zodResolver(taskTypeSchema),
    defaultValues: {
      name: taskType?.name || "",
      description: taskType?.description || "",
      price: Number(taskType?.price) || 0,
      status: taskType?.status || "ACTIVE",
    },
  });

  const onFormSubmit = async (values: TaskTypeFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values as TaskTypeCreateInput);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative text-gray-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {taskType ? "Edit Task Type" : "Add New Task Type"}
          </h2>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Sewing - Large"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (LKR)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                placeholder="Optional details about this task type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                rows={3}
              />
            </div>

            {taskType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register("status")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : taskType
                    ? "Update Task"
                    : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
