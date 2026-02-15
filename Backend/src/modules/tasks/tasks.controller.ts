import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskTypeDto, UpdateTaskTypeDto } from './dto/task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { UserRequest } from '../../common/interfaces/user-request.interface';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Task Types
  @Post('types')
  createTaskType(@Body() createTaskTypeDto: CreateTaskTypeDto) {
    return this.tasksService.createTaskType(createTaskTypeDto);
  }

  @Get('types')
  findAllTaskTypes(@Query('status') status?: string) {
    return this.tasksService.findAllTaskTypes(status);
  }

  @Get('types/:id')
  findOneTaskType(@Param('id') id: string) {
    return this.tasksService.findOneTaskType(id);
  }

  @Patch('types/:id')
  updateTaskType(
    @Param('id') id: string,
    @Body() updateTaskTypeDto: UpdateTaskTypeDto,
    @Request() req: UserRequest,
  ) {
    return this.tasksService.updateTaskType(id, updateTaskTypeDto, req.user.id);
  }

  @Delete('types/:id')
  removeTaskType(@Param('id') id: string) {
    return this.tasksService.removeTaskType(id);
  }

  // Completed Tasks
  @Get('completed')
  findAllCompletedTasks(
    @Query('employeeId') employeeId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.tasksService.findAllCompletedTasks(
      employeeId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('stats')
  getTaskStats() {
    return this.tasksService.getTaskStats();
  }
}
