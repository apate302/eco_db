import * as userRepository from '../repositories/userRepository.js';

export const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

export const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUser = async (id, data) => {
  await getUserById(id); // Check existence
  return await userRepository.updateUser(id, data);
};

export const deleteUser = async (id) => {
  await getUserById(id); // Check existence
  await userRepository.deleteUser(id);
};
