import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json(result);
};
