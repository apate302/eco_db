import * as productRepo from '../repositories/productRepository.js';

export const createProduct = async (data) => {
  return await productRepo.createProduct(data);
};

export const getProducts = async () => {
  return await productRepo.getProducts();
};

export const getProductById = async (id) => {
  const product = await productRepo.getProductById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
};

export const updateProduct = async (id, data) => {
  await getProductById(id); // ensure it exists
  return await productRepo.updateProduct(id, data);
};

export const deleteProduct = async (id) => {
  await getProductById(id); // ensure it exists
  return await productRepo.deleteProduct(id);
};
