import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Query,
  Body,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { UserRequest } from '../../common/interfaces/user-request.interface';

@Controller('payroll')
@UseGuards(JwtAuthGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post('generate')
  generatePayroll(
    @Body('month') month: number,
    @Body('year') year: number,
    @Request() req: UserRequest,
  ) {
    return this.payrollService.generatePayroll(month, year, req.user.id);
  }

  @Get()
  findAll(@Query('month') month?: string, @Query('year') year?: string) {
    return this.payrollService.findAll(
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined,
    );
  }

  @Get('employee/:employeeId')
  findByEmployee(@Query('employeeId') employeeId: string) {
    return this.payrollService.findByEmployee(employeeId);
  }
}
