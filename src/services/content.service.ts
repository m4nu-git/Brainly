import { ContentRepository } from "../repositories/content.repository";
import { AutoTagService } from "./autoTag.service";

interface ContentFilters {
  type?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const ContentService = {
  addContent: async (
    title: string,
    type: string,
    link: string,
    userId: string,
    tags?: string[],
    content?: string
  ) => {
    const autoTagIds = await AutoTagService.generate(
      title,
      content ?? "",
      userId
    ).catch(() => [] as string[]);

    const mergedTags = [...new Set([...(tags ?? []), ...autoTagIds])];
    return ContentRepository.create({ title, type, link, userId, content, tags: mergedTags });
  },

  getContent: (userId: string, filters: ContentFilters) =>
    ContentRepository.findByUserIdFiltered(userId, filters),

  updateContent: async (
    id: string,
    userId: string,
    data: { title?: string; type?: string; link?: string; content?: string; tags?: string[] }
  ) => {
    const existing = await ContentRepository.findByIdAndUserId(id, userId);
    if (!existing) return { notFound: true as const };
    const updated = await ContentRepository.updateById(id, data);
    return { content: updated };
  },

  deleteContent: (contentId: string, userId: string) =>
    ContentRepository.deleteOne(contentId, userId),
};
