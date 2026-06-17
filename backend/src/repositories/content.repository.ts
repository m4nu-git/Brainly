import mongoose from "mongoose";
import { ContentModel } from "../models/content.model";

interface ContentFilters {
  type?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const ContentRepository = {
  create: (data: {
    title: string;
    type: string;
    link: string;
    userId: string;
    content?: string;
    tags?: string[];
  }) => ContentModel.create({ ...data, tags: data.tags ?? [] }),

  findByUserId: (userId: string) => ContentModel.find({ userId }),

  findByUserIdFiltered: (userId: string, filters: ContentFilters) => {
    const query: Record<string, unknown> = { userId };
    if (filters.type) query.type = filters.type;
    if (filters.tag) query.tags = new mongoose.Types.ObjectId(filters.tag);
    if (filters.search) query.title = { $regex: filters.search, $options: "i" };
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    return ContentModel.find(query)
      .populate("tags", "name")
      .skip((page - 1) * limit)
      .limit(limit);
  },

  findByIdAndUserId: (id: string, userId: string) =>
    ContentModel.findOne({ _id: id, userId }),

  updateById: (
    id: string,
    data: { title?: string; type?: string; link?: string; tags?: string[] }
  ) => ContentModel.findByIdAndUpdate(id, { $set: data }, { new: true }),

  // bug fix: was { contentId, userId } — contentId is not a schema field, the PK is _id
  deleteOne: (contentId: string, userId: string) =>
    ContentModel.deleteOne({ _id: contentId, userId }),
};
