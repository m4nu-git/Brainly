import { TagRepository } from "../repositories/tag.repository";

export const TagService = {
  createTag: async (name: string, userId: string) => {
    const existing = await TagRepository.findByNameAndUserId(name, userId);
    if (existing) return { conflict: true as const };
    const tag = await TagRepository.create(name, userId);
    return { tag };
  },

  getTags: (userId: string) => TagRepository.findAllByUserId(userId),

  deleteTag: async (id: string, userId: string) => {
    const tag = await TagRepository.findByIdAndUserId(id, userId);
    if (!tag) return { notFound: true as const };
    await TagRepository.deleteById(id);
    return { success: true as const };
  },
};
