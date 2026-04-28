import * as userService from '../services/userService.js';

export const getUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Validation Error: Id must be an integer" });
  }
  const user = await userService.getUserById(id);
  res.status(200).json(user);
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Validation Error: Id must be an integer" });
  }
  const user = await userService.updateUser(id, req.body);
  res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Validation Error: Id must be an integer" });
  }
  await userService.deleteUser(id);
  res.status(204).send();
};
