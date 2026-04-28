import prisma from '../utils/prisma.js';

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};
