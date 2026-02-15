import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskSubmissionDto } from '../tasks/dto/task.dto';
import { Prisma } from '@prisma/client';
import type { Employee, TaskType } from '@prisma/client';

const submissionWithDetails = {
  employee: true,
  tasks: {
    include: {
      taskType: true,
    },
  },
} as const;

const submissionWithEmployee = {
  employee: true,
} as const;

type TaskSubmissionWithDetails = Prisma.TaskSubmissionGetPayload<{
  include: {
    employee: true;
    tasks: {
      include: {
        taskType: true;
      };
    };
  };
}>;

type TaskSubmissionWithEmployee = Prisma.TaskSubmissionGetPayload<{
  include: {
    employee: true;
  };
}>;

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSubmissionDto: CreateTaskSubmissionDto,
  ): Promise<TaskSubmissionWithDetails> {
    const { employeeId, tasks, notes } = createSubmissionDto;

    // 1. Verify data and pre-fetch task types in bulk
    const taskTypeIds = tasks.map((t) => t.taskTypeId);

    const [employee, taskTypes] = (await Promise.all([
      this.prisma.employee.findUnique({
        where: { id: employeeId },
      }),
      this.prisma.taskType.findMany({
        where: { id: { in: taskTypeIds } },
      }),
    ])) as unknown as [Employee | null, TaskType[]];

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const taskTypeMap = new Map<string, TaskType>(
      taskTypes.map((tt) => [tt.id, tt]),
    );
    let submissionTotal = new Prisma.Decimal(0);
    const tasksToCreate: Omit<
      Prisma.CompletedTaskCreateManyInput,
      'submissionId'
    >[] = [];

    for (const entry of tasks) {
      if (entry.quantity <= 0) continue;

      const taskType = taskTypeMap.get(entry.taskTypeId);
      if (!taskType) {
        throw new NotFoundException(`Task type ${entry.taskTypeId} not found`);
      }

      const priceAtTime = new Prisma.Decimal(taskType.price);
      const totalAmount = priceAtTime.mul(entry.quantity);
      submissionTotal = submissionTotal.add(totalAmount);

      tasksToCreate.push({
        employeeId,
        taskTypeId: entry.taskTypeId,
        quantity: entry.quantity,
        priceAtTime,
        totalAmount,
        notes: entry.notes,
      });
    }

    // 2. Short transaction for writes
    return this.prisma.$transaction(
      async (
        tx: Prisma.TransactionClient,
      ): Promise<TaskSubmissionWithDetails> => {
        const createData: Prisma.TaskSubmissionUncheckedCreateInput = {
          employeeId,
          totalAmount: submissionTotal,
          notes,
        };

        const submission = await tx.taskSubmission.create({
          data: createData,
        });

        const completedTasksData: Prisma.CompletedTaskCreateManyInput[] =
          tasksToCreate.map((task) => ({
            ...task,
            submissionId: submission.id,
          }));

        await tx.completedTask.createMany({
          data: completedTasksData,
        });

        const result = (await tx.taskSubmission.findUnique({
          where: { id: submission.id },
          include: submissionWithDetails,
        })) as TaskSubmissionWithDetails | null;

        if (!result) {
          throw new NotFoundException('Submission created but not found');
        }

        return result;
      },
      {
        timeout: 15000,
      },
    );
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    employeeName?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    items: TaskSubmissionWithEmployee[];
    total: number;
    skip?: number;
    take?: number;
  }> {
    const { skip, take, employeeName, startDate, endDate } = params;

    const where: Prisma.TaskSubmissionWhereInput = {
      ...(employeeName && {
        employee: {
          OR: [
            {
              firstName: {
                contains: employeeName,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: employeeName,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
      }),
      ...(startDate &&
        endDate && {
          submissionDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    };

    const findManyPromise = this.prisma.taskSubmission.findMany({
      skip,
      take,
      where,
      include: submissionWithEmployee,
      orderBy: { submissionDate: 'desc' },
    });

    const countPromise = this.prisma.taskSubmission.count({ where });

    const [items, total] = (await Promise.all([
      findManyPromise,
      countPromise,
    ])) as unknown as [TaskSubmissionWithEmployee[], number];

    return {
      items,
      total,
      skip,
      take,
    };
  }

  async findOne(id: string): Promise<TaskSubmissionWithDetails> {
    const submission = (await this.prisma.taskSubmission.findUnique({
      where: { id },
      include: submissionWithDetails,
    })) as TaskSubmissionWithDetails | null;

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }
}
