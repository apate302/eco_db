import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../repositories/userRepository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const registerUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await createUser({
    ...userData,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token, user: { id: user.id, email: user.email, role: user.role, name: user.name } };
};
