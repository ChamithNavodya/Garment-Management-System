"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Employee, TaskType, CreateTaskSubmissionInput } from "@/types";
import { X, Plus, Trash2 } from "lucide-react";

const submissionSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  notes: z.string().optional(),
  tasks: z
    .array(
      z.object({
        taskTypeId: z.string().min(1, "Task type is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        notes: z.string().optional(),
      }),
    )
    .min(1, "At least one task is required"),
});

type SubmissionFormValues = z.infer<typeof submissionSchema>;

interface SubmissionFormProps {
  employees: Employee[];
  taskTypes: TaskType[];
  onClose: () => void;
  onSubmit: (data: CreateTaskSubmissionInput) => Promise<void>;
}

export default function SubmissionForm({
  employees,
  taskTypes,
  onClose,
  onSubmit,
}: SubmissionFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      tasks: [{ taskTypeId: "", quantity: 1, notes: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const onFormSubmit = async (values: SubmissionFormValues) => {
    setLoading(true);
    try {
      await onSubmit(values as CreateTaskSubmissionInput);
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <X size={20} />
        </button>

        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">
            New Task Submission
          </h2>
          <p className="text-gray-500">
            Record a batch of tasks completed by an employee.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <form
            id="submission-form"
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Employee
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
                  General Notes
                </label>
                <input
                  {...register("notes")}
                  placeholder="Optional notes for this submission"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Task Breakdown
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    append({ taskTypeId: "", quantity: 1, notes: "" })
                  }
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50 p-4 rounded-xl border border-gray-100"
                  >
                    <div className="md:col-span-4">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Task Type
                      </label>
                      <select
                        {...register(`tasks.${index}.taskTypeId`)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
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
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.quantity`, {
                          valueAsNumber: true,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
                      />
                    </div>

                    <div className="md:col-span-5">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Note
                      </label>
                      <input
                        type="text"
                        {...register(`tasks.${index}.notes`)}
                        placeholder="Specific note..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900"
                      />
                    </div>

                    <div className="md:col-span-1 flex justify-center pb-2">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {errors.tasks && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tasks.message}
                </p>
              )}
            </div>
          </form>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            form="submission-form"
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Save Submission"}
          </button>
        </div>
      </div>
    </div>
  );
}
