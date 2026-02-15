import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Employee, Payroll, SalaryConfig } from '../../generated/client';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  async generatePayroll(month: number, year: number, userId: string) {
    // Get all active employees
    const employees: (Employee & { salaryConfigs: SalaryConfig[] })[] =
      await this.prisma.employee.findMany({
        where: { status: 'ACTIVE' },
        include: {
          salaryConfigs: {
            where: { isActive: true },
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
      });

    const payrolls = [];

    for (const employee of employees) {
      // Check if payroll already exists
      const existing: Payroll | null = await this.prisma.payroll.findUnique({
        where: {
          employeeId_month_year: {
            employeeId: employee.id,
            month,
            year,
          },
        },
      });

      if (existing) {
        continue; // Skip if already generated
      }

      if (employee.employeeType === 'PERMANENT') {
        const salaryConfig = employee.salaryConfigs[0];
        if (!salaryConfig) continue;

        const basicSalary = salaryConfig.basicSalary;
        const allowance = salaryConfig.allowance;
        const epfDeduction =
          Number(basicSalary) * (Number(salaryConfig.epfPercentage) / 100);
        const etfContribution =
          Number(basicSalary) * (Number(salaryConfig.etfPercentage) / 100);
        const netSalary =
          Number(basicSalary) + Number(allowance) - epfDeduction;

        const payroll: Payroll = await this.prisma.payroll.create({
          data: {
            employeeId: employee.id,
            month,
            year,
            employeeType: 'PERMANENT',
            basicSalary,
            allowance,
            epfDeduction,
            etfContribution,
            netSalary,
            generatedBy: userId,
          },
        });

        payrolls.push(payroll);
      } else if (employee.employeeType === 'TEMPORARY') {
        // Get completed tasks for the month
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const completedTasks = await this.prisma.completedTask.findMany({
          where: {
            employeeId: employee.id,
            completedDate: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        const totalTaskAmount = completedTasks.reduce(
          (sum, task) => sum + Number(task.totalAmount),
          0,
        );

        const payroll: Payroll = await this.prisma.payroll.create({
          data: {
            employeeId: employee.id,
            month,
            year,
            employeeType: 'TEMPORARY',
            totalTaskAmount,
            netSalary: totalTaskAmount,
            generatedBy: userId,
          },
        });

        payrolls.push(payroll);
      }
    }

    return {
      message: `Generated payroll for ${payrolls.length} employees`,
      payrolls,
    };
  }

  async findAll(month?: number, year?: number) {
    return this.prisma.payroll.findMany({
      where: {
        ...(month && { month }),
        ...(year && { year }),
      },
      include: {
        employee: true,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.payroll.findMany({
      where: { employeeId },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
  }
}
