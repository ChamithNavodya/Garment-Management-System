export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  nicNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  employeeType: "PERMANENT" | "TEMPORARY";
  status: "ACTIVE" | "INACTIVE";
  salaryConfigs?: SalaryConfig[];
  createdAt: string;
  updatedAt: string;
}

export interface SalaryConfig {
  id: string;
  employeeId: string;
  basicSalary: number;
  allowance: number;
  epfPercentage: number;
  etfPercentage: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
}

export interface TaskType {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface CompletedTask {
  id: string;
  employeeId: string;
  taskTypeId: string;
  quantity: number;
  priceAtTime: number;
  totalAmount: number;
  completedDate: string;
  notes?: string;
  employee?: Employee;
  taskType?: TaskType;
  submissionId: string;
}

export interface TaskSubmission {
  id: string;
  employeeId: string;
  totalAmount: number;
  submissionDate: string;
  notes?: string;
  employee?: Employee;
  tasks?: CompletedTask[];
  createdAt: string;
  updatedAt: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  employeeType: "PERMANENT" | "TEMPORARY";
  basicSalary?: number;
  allowance?: number;
  epfDeduction?: number;
  etfContribution?: number;
  totalTaskAmount?: number;
  netSalary: number;
  status: "PENDING" | "APPROVED" | "PAID";
  generatedBy: string;
  generatedAt: string;
  employee?: Employee;
}

export interface DashboardStats {
  employees: {
    total: number;
    permanent: number;
    temporary: number;
    active: number;
  };
  tasks: {
    total: number;
    today: number;
  };
  payroll: {
    thisMonth: number;
  };
}

export interface SalaryConfigInput {
  basicSalary: number;
  allowance: number;
  epfPercentage: number;
  etfPercentage: number;
}

export interface EmployeeCreateInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  nicNumber: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  age: number;
  employeeType: "PERMANENT" | "TEMPORARY";
  status: "ACTIVE" | "INACTIVE";
  permanent?: SalaryConfigInput;
}

export type EmployeeUpdateInput = Partial<EmployeeCreateInput>;

export interface TaskTypeCreateInput {
  name: string;
  description?: string;
  price: number;
  status?: "ACTIVE" | "INACTIVE";
}

export type TaskTypeUpdateInput = Partial<TaskTypeCreateInput> & {
  status?: "ACTIVE" | "INACTIVE";
};

export interface CompletedTaskCreateInput {
  employeeId: string;
  taskTypeId: string;
  quantity: number;
  notes?: string;
}

export interface BulkTaskEntry {
  taskTypeId: string;
  quantity: number;
  notes?: string;
}

export interface CreateTaskSubmissionInput {
  employeeId: string;
  tasks: BulkTaskEntry[];
  notes?: string;
}
