import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskTypeDto, UpdateTaskTypeDto } from './dto/task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // ========== TASK TYPES ==========

  async createTaskType(createTaskTypeDto: CreateTaskTypeDto) {
    const existing = await this.prisma.taskType.findUnique({
      where: { name: createTaskTypeDto.name },
    });

    if (existing) {
      throw new BadRequestException('Task type with this name already exists');
    }

    return this.prisma.taskType.create({
      data: {
        ...createTaskTypeDto,
        price: createTaskTypeDto.price,
      },
    });
  }

  async findAllTaskTypes(status?: string) {
    return this.prisma.taskType.findMany({
      where: status ? { status: status as TaskStatus } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneTaskType(id: string) {
    const taskType = await this.prisma.taskType.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!taskType) {
      throw new NotFoundException('Task type not found');
    }

    return taskType;
  }

  async updateTaskType(
    id: string,
    updateTaskTypeDto: UpdateTaskTypeDto,
    userId: string,
  ) {
    const taskType = await this.findOneTaskType(id);

    // If price is being updated, log to history
    if (
      updateTaskTypeDto.price &&
      updateTaskTypeDto.price !== Number(taskType.price)
    ) {
      await this.prisma.taskPriceHistory.create({
        data: {
          taskTypeId: id,
          oldPrice: taskType.price,
          newPrice: updateTaskTypeDto.price,
          changedBy: userId,
        },
      });
    }

    return this.prisma.taskType.update({
      where: { id },
      data: {
        ...updateTaskTypeDto,
        ...(updateTaskTypeDto.price && {
          price: updateTaskTypeDto.price,
        }),
      },
    });
  }

  async removeTaskType(id: string) {
    await this.findOneTaskType(id);

    await this.prisma.taskType.delete({
      where: { id },
    });

    return { message: 'Task type deleted successfully' };
  }

  // ========== COMPLETED TASKS (Deprecating direct creation, use Submissions) ==========

  async findAllCompletedTasks(
    employeeId?: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    return this.prisma.completedTask.findMany({
      where: {
        ...(employeeId && { employeeId }),
        ...(startDate &&
          endDate && {
            completedDate: {
              gte: startDate,
              lte: endDate,
            },
          }),
      },
      include: {
        employee: true,
        taskType: true,
      },
      orderBy: { completedDate: 'desc' },
    });
  }

  async getTaskStats() {
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

    return {
      totalTasks,
      tasksToday,
    };
  }
}
