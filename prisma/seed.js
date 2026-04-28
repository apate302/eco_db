import bcrypt from 'bcryptjs';
import prisma from '../src/utils/prisma.js';

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('AdminPassword123!', salt);
  const customerPassword = await bcrypt.hash('CustomerPassword123!', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Regular Customer',
      role: 'CUSTOMER'
    }
  });

  // Create Products
  const laptop = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'High-performance laptop for development',
      price: 1200.0,
      stock: 10
    }
  });

  const mouse = await prisma.product.create({
    data: {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      price: 25.0,
      stock: 50
    }
  });

  // Create Review
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Amazing laptop, fast and reliable!',
      userId: customer.id,
      productId: laptop.id
    }
  });

  // Create Order
  await prisma.order.create({
    data: {
      userId: customer.id,
      totalPrice: 1225.0,
      status: 'PENDING',
      orderItems: {
        create: [
          {
            productId: laptop.id,
            quantity: 1,
            priceAtPurchase: 1200.0
          },
          {
            productId: mouse.id,
            quantity: 1,
            priceAtPurchase: 25.0
          }
        ]
      }
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
