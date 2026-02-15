import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import {
  Prisma,
  EmployeeType,
  EmployeeStatus,
  SalaryConfig,
  type Employee,
} from '../../generated/client';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { permanent, ...employeeData } = createEmployeeDto;

    // Check if NIC already exists
    const existingEmployee: Employee | null =
      await this.prisma.employee.findUnique({
        where: { nicNumber: employeeData.nicNumber },
      });

    if (existingEmployee) {
      throw new BadRequestException('Employee with this NIC already exists');
    }

    // Create employee
    const employee: Employee = await this.prisma.employee.create({
      data: {
        ...employeeData,
        employeeType: employeeData.employeeType || EmployeeType.PERMANENT,
        status: employeeData.status || EmployeeStatus.ACTIVE,
      } as Prisma.EmployeeCreateInput,
    });

    // If permanent employee, create salary config
    if (
      (employeeData.employeeType === EmployeeType.PERMANENT ||
        !employeeData.employeeType) &&
      permanent
    ) {
      await this.prisma.salaryConfig.create({
        data: {
          employeeId: employee.id,
          basicSalary: permanent.basicSalary,
          allowance: permanent.allowance || 0,
          epfPercentage: permanent.epfPercentage || 8,
          etfPercentage: permanent.etfPercentage || 3,
        },
      });
    }

    return this.findOne(employee.id);
  }

  async findAll(type?: string, status?: string) {
    const employees: (Employee & { salaryConfigs: SalaryConfig[] })[] =
      await this.prisma.employee.findMany({
        where: {
          ...(type && { employeeType: type as EmployeeType }),
          ...(status && { status: status as EmployeeStatus }),
        },
        include: {
          salaryConfigs: {
            where: { isActive: true },
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    return employees;
  }

  async findOne(id: string) {
    const employee: Prisma.EmployeeGetPayload<{
      include: { salaryConfigs: true };
    }> | null = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        salaryConfigs: {
          orderBy: { effectiveFrom: 'desc' },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const currentEmployee = await this.findOne(id); // Check if exists

    const { permanent, ...updateData } = updateEmployeeDto;

    // Check if NIC is being updated and if it's already taken
    if (
      updateData.nicNumber &&
      updateData.nicNumber !== currentEmployee.nicNumber
    ) {
      const existingWithNic = await this.prisma.employee.findUnique({
        where: { nicNumber: updateData.nicNumber },
      });
      if (existingWithNic) {
        throw new BadRequestException(
          'Another employee with this NIC already exists',
        );
      }
    }

    // Update employee basic info
    await this.prisma.employee.update({
      where: { id },
      data: updateData as Prisma.EmployeeUpdateInput,
    });

    // Handle salary config update if provided
    if (permanent) {
      // Deactivate old config
      await this.prisma.salaryConfig.updateMany({
        where: { employeeId: id, isActive: true },
        data: { isActive: false, effectiveTo: new Date() },
      });

      // Create new config
      await this.prisma.salaryConfig.create({
        data: {
          employeeId: id,
          basicSalary: permanent.basicSalary,
          allowance: permanent.allowance || 0,
          epfPercentage: permanent.epfPercentage || 8,
          etfPercentage: permanent.etfPercentage || 3,
        },
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    await this.prisma.employee.delete({
      where: { id },
    });

    return { message: 'Employee deleted successfully' };
  }

  async getStats() {
    const [total, permanent, temporary, active, inactive]: number[] =
      await Promise.all([
        this.prisma.employee.count(),
        this.prisma.employee.count({ where: { employeeType: 'PERMANENT' } }),
        this.prisma.employee.count({ where: { employeeType: 'TEMPORARY' } }),
        this.prisma.employee.count({ where: { status: 'ACTIVE' } }),
        this.prisma.employee.count({ where: { status: 'INACTIVE' } }),
      ]);

    return {
      total,
      byType: {
        permanent,
        temporary,
      },
      byStatus: {
        active,
        inactive,
      },
    };
  }
}
