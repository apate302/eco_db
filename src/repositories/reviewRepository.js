import prisma from '../utils/prisma.js';

export const createReview = async (data) => {
  return await prisma.review.create({ data });
};

export const getAllReviews = async () => {
  return await prisma.review.findMany({
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  });
};

export const getReviewsByProduct = async (productId) => {
  return await prisma.review.findMany({
    where: { productId: parseInt(productId) },
    include: {
      user: {
        select: { id: true, name: true }
      }
    }
  });
};

export const getReviewById = async (id) => {
  return await prisma.review.findUnique({ where: { id: parseInt(id) } });
};

export const updateReview = async (id, data) => {
  return await prisma.review.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const deleteReview = async (id) => {
  return await prisma.review.delete({
    where: { id: parseInt(id) },
  });
};
