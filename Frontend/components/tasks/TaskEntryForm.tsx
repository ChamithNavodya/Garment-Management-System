"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Employee, TaskType, CompletedTaskCreateInput } from "@/types";

const taskEntrySchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  taskTypeId: z.string().min(1, "Task type is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

type TaskEntryFormValues = z.infer<typeof taskEntrySchema>;

interface TaskEntryFormProps {
  employees: Employee[];
  taskTypes: TaskType[];
  onSubmit: (data: CompletedTaskCreateInput) => Promise<void>;
}

export default function TaskEntryForm({
  employees,
  taskTypes,
  onSubmit,
}: TaskEntryFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskEntryFormValues>({
    resolver: zodResolver(taskEntrySchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onFormSubmit = async (values: TaskEntryFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values as CompletedTaskCreateInput);
      reset({ ...values, quantity: 1, notes: "" }); // Reset for next entry but keep employee
    } catch (error) {
      console.error("Task entry error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Record Daily Task</h2>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee
            </label>
            <select
              {...register("employeeId")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeType})
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.employeeId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Type
            </label>
            <select
              {...register("taskTypeId")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            >
              <option value="">Select Task</option>
              {taskTypes
                .filter((t) => t.status === "ACTIVE")
                .map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.name} (LKR {Number(task.price)})
                  </option>
                ))}
            </select>
            {errors.taskTypeId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.taskTypeId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
            {errors.quantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <input
              type="text"
              {...register("notes")}
              placeholder="Optional notes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Recording..." : "Record Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
