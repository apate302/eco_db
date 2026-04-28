import * as reviewRepo from '../repositories/reviewRepository.js';
import * as productRepo from '../repositories/productRepository.js';

export const createReview = async (userId, data) => {
  const product = await productRepo.getProductById(data.productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return await reviewRepo.createReview({
    ...data,
    userId,
  });
};

export const getAllReviews = async () => {
  return await reviewRepo.getAllReviews();
};

export const getReviewById = async (id) => {
  const review = await reviewRepo.getReviewById(id);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }
  return review;
};

export const getReviewsByProduct = async (productId) => {
  return await reviewRepo.getReviewsByProduct(productId);
};

export const updateReview = async (userId, reviewId, data) => {
  const review = await reviewRepo.getReviewById(reviewId);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  if (review.userId !== userId) {
    const error = new Error('Forbidden: You do not own this review');
    error.statusCode = 403;
    throw error;
  }

  return await reviewRepo.updateReview(reviewId, data);
};

export const deleteReview = async (user, reviewId) => {
  const review = await reviewRepo.getReviewById(reviewId);
  if (!review) {
    const error = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  if (review.userId !== user.userId && user.role !== 'ADMIN') {
    const error = new Error('Forbidden: You do not have permission to delete this review');
    error.statusCode = 403;
    throw error;
  }

  return await reviewRepo.deleteReview(reviewId);
};
