import { TagModel } from "../models/tag.model";

export const TagRepository = {
  create: (name: string, userId: string) => TagModel.create({ name, userId }),
  findAllByUserId: (userId: string) => TagModel.find({ userId }),
  findByNameAndUserId: (name: string, userId: string) =>
    TagModel.findOne({ name, userId }),
  findByIdAndUserId: (id: string, userId: string) =>
    TagModel.findOne({ _id: id, userId }),
  deleteById: (id: string) => TagModel.deleteOne({ _id: id }),

  upsertMany: async (names: string[], userId: string): Promise<string[]> => {
    if (names.length === 0) return [];
    const results = await Promise.all(
      names.map((name) =>
        TagModel.findOneAndUpdate(
          { name, userId },
          { $setOnInsert: { name, userId } },
          { upsert: true, new: true }
        )
      )
    );
    return results
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .map((t) => t._id.toString());
  },
};
