import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

const BCRYPT_ROUNDS = 10;

export const UserService = {
  signup: async (username: string, password: string) => {
    const existing = await UserRepository.findByUsername(username);
    if (existing) return { conflict: true as const };
    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    await UserRepository.create(username, hashed);
    return { success: true as const };
  },

  signin: async (username: string, password: string) => {
    const user = await UserRepository.findByUsername(username);
    if (!user || !user.password) return { invalidCredentials: true as const };
    const match = await bcrypt.compare(password, user.password);
    if (!match) return { invalidCredentials: true as const };
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET as string
    );
    return { token, username: user.username };
  },
};
