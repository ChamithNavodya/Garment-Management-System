import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    // Employee stats
    const [
      totalEmployees,
      permanentEmployees,
      temporaryEmployees,
      activeEmployees,
    ] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.employee.count({ where: { employeeType: 'PERMANENT' } }),
      this.prisma.employee.count({ where: { employeeType: 'TEMPORARY' } }),
      this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
    ]);

    // Task stats
    const totalTasks = await this.prisma.completedTask.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasksToday = await this.prisma.completedTask.count({
      where: {
        completedDate: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Payroll stats
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const payrollsThisMonth = await this.prisma.payroll.count({
      where: {
        month: currentMonth,
        year: currentYear,
      },
    });

    return {
      employees: {
        total: totalEmployees,
        permanent: permanentEmployees,
        temporary: temporaryEmployees,
        active: activeEmployees,
      },
      tasks: {
        total: totalTasks,
        today: tasksToday,
      },
      payroll: {
        thisMonth: payrollsThisMonth,
      },
    };
  }

  async getDailyActivity(date?: Date) {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const completedTasks = await this.prisma.completedTask.findMany({
      where: {
        completedDate: {
          gte: targetDate,
          lt: nextDay,
        },
      },
      include: {
        employee: true,
        taskType: true,
      },
      orderBy: { completedDate: 'desc' },
    });

    return completedTasks;
  }
}
