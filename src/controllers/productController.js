import * as productService from '../services/productService.js';

export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};

export const getProducts = async (req, res) => {
  const products = await productService.getProducts();
  res.status(200).json(products);
};

export const getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Validation Error: Id must be an integer" });
  }
  const product = await productService.getProductById(id);
  res.status(200).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json(product);
};

export const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).send();
};
