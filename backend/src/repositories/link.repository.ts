import { LinkModel } from "../models/link.model";

export const LinkRepository = {
  findByUserId: (userId: string) => LinkModel.findOne({ userId }),
  findByHash: (hash: string) => LinkModel.findOne({ hash }),
  create: (userId: string, hash: string) => LinkModel.create({ userId, hash }),
  deleteByUserId: (userId: string) => LinkModel.deleteOne({ userId }),
};
