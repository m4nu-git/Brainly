import { UserModel } from "../models/user.model";

export const UserRepository = {
  findByUsername: (username: string) => UserModel.findOne({ username }),
  findById: (id: string) => UserModel.findById(id),
  create: (username: string, hashedPassword: string) =>
    UserModel.create({ username, password: hashedPassword }),
};
