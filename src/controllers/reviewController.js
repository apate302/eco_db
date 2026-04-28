import * as reviewService from '../services/reviewService.js';

export const createReview = async (req, res) => {
  const review = await reviewService.createReview(req.user.userId, req.body);
  res.status(201).json(review);
};

export const getAllReviews = async (req, res) => {
  const reviews = await reviewService.getAllReviews();
  res.status(200).json(reviews);
};

export const getReviewById = async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  res.status(200).json(review);
};

export const getReviewsByProduct = async (req, res) => {
  const reviews = await reviewService.getReviewsByProduct(req.params.productId);
  res.status(200).json(reviews);
};

export const updateReview = async (req, res) => {
  const review = await reviewService.updateReview(req.user.userId, req.params.id, req.body);
  res.status(200).json(review);
};

export const deleteReview = async (req, res) => {
  await reviewService.deleteReview(req.user, req.params.id);
  res.status(204).send();
};
