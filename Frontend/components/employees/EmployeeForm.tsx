"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Employee, EmployeeCreateInput, SalaryConfigInput } from "@/types";
import { X } from "lucide-react";

const employeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().optional(),
  nicNumber: z.string().min(10, "Valid NIC number is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  age: z.number().min(18, "Must be at least 18"),
  employeeType: z.enum(["PERMANENT", "TEMPORARY"]),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  basicSalary: z.number().min(0).optional(),
  allowance: z.number().min(0).optional(),
  epfPercentage: z.number().min(0).max(100).optional(),
  etfPercentage: z.number().min(0).max(100).optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  onSubmit: (data: EmployeeCreateInput) => Promise<void>;
}

export default function EmployeeForm({
  employee,
  onClose,
  onSubmit,
}: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);

  // Find active salary config once
  const activeSalary = employee?.salaryConfigs?.find((s) => s.isActive);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: employee?.firstName || "",
      lastName: employee?.lastName || "",
      email: employee?.email || "",
      phone: employee?.phone || "",
      address: employee?.address || "",
      nicNumber: employee?.nicNumber || "",
      gender: employee?.gender || "MALE",
      age: Number(employee?.age) || 20,
      employeeType: employee?.employeeType || "PERMANENT",
      status: employee?.status || "ACTIVE",
      basicSalary: Number(activeSalary?.basicSalary) || 0,
      allowance: Number(activeSalary?.allowance) || 0,
      epfPercentage: Number(activeSalary?.epfPercentage) || 8,
      etfPercentage: Number(activeSalary?.etfPercentage) || 3,
    },
  });

  const employeeType = watch("employeeType");

  const onFormSubmit = async (values: EmployeeFormValues) => {
    setLoading(true);
    try {
      const { basicSalary, allowance, epfPercentage, etfPercentage, ...rest } =
        values;

      const payload: EmployeeCreateInput = {
        ...rest,
        email: values.email || undefined,
        address: values.address || undefined,
      };

      if (values.employeeType === "PERMANENT") {
        payload.permanent = {
          basicSalary: basicSalary || 0,
          allowance: allowance || 0,
          epfPercentage: epfPercentage || 0,
          etfPercentage: etfPercentage || 0,
        } as SalaryConfigInput;
      }

      await onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-gray-900">
          <h2 className="text-2xl font-bold mb-6">
            {employee ? "Edit Employee" : "Register New Employee"}
          </h2>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register("email")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC Number
                </label>
                <input
                  {...register("nicNumber")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                {errors.nicNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.nicNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  {...register("employeeType")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                >
                  <option value="PERMANENT">Permanent</option>
                  <option value="TEMPORARY">Temporary</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  rows={2}
                />
              </div>

              {employeeType === "PERMANENT" && (
                <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-4">
                  <h3 className="text-sm font-bold text-blue-900 border-b border-blue-200 pb-2">
                    Salary Configuration
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Basic Salary (LKR)
                      </label>
                      <input
                        type="number"
                        {...register("basicSalary", { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        Allowance (LKR)
                      </label>
                      <input
                        type="number"
                        {...register("allowance", { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        EPF %
                      </label>
                      <input
                        type="number"
                        {...register("epfPercentage", { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white outline-none text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-700 mb-1">
                        ETF %
                      </label>
                      <input
                        type="number"
                        {...register("etfPercentage", { valueAsNumber: true })}
                        className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
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
                  : employee
                    ? "Update Employee"
                    : "Register Employee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
