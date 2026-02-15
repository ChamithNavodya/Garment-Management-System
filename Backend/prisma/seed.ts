import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@garment.com' },
    update: {},
    create: {
      email: 'admin@garment.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create task types
  const taskTypes = [
    {
      name: 'Back Pocket Outline',
      price: 25,
      description: 'Outline stitching for back pocket',
    },
    { name: 'Band Attach', price: 30, description: 'Attach band to garment' },
    { name: 'Zipper Install', price: 35, description: 'Install zipper' },
    { name: 'Button Attach', price: 15, description: 'Attach buttons' },
    { name: 'Hem Finish', price: 20, description: 'Finish hem' },
  ];

  for (const task of taskTypes) {
    await prisma.taskType.upsert({
      where: { name: task.name },
      update: {},
      create: task,
    });
  }

  console.log('✅ Created task types');

  // Create sample employees
  const employees = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+94771234567',
      nicNumber: '123456789V',
      gender: 'MALE',
      age: 30,
      employeeType: 'PERMANENT',
      permanent: {
        basicSalary: 50000,
        allowance: 10000,
        epfPercentage: 8,
        etfPercentage: 3,
      },
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+94771234568',
      nicNumber: '987654321V',
      gender: 'FEMALE',
      age: 25,
      employeeType: 'TEMPORARY',
    },
  ];

  for (const emp of employees) {
    const { permanent, ...empData } = emp as any;

    const employee = await prisma.employee.upsert({
      where: { nicNumber: empData.nicNumber },
      update: {},
      create: empData,
    });

    if (permanent && emp.employeeType === 'PERMANENT') {
      await prisma.salaryConfig.upsert({
        where: { id: employee.id + '-default' },
        update: {},
        create: {
          employeeId: employee.id,
          ...permanent,
        },
      });
    }
  }

  console.log('✅ Created sample employees');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
