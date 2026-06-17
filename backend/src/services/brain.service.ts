import { LinkRepository } from "../repositories/link.repository";
import { ContentRepository } from "../repositories/content.repository";
import { UserRepository } from "../repositories/user.repository";
import { random } from "../utils/utils";

export const BrainService = {
  shareLink: async (userId: string, share: boolean) => {
    if (share) {
      const existing = await LinkRepository.findByUserId(userId);
      if (existing) return { hash: existing.hash };
      const hash = random(10);
      await LinkRepository.create(userId, hash);
      return { hash };
    } else {
      await LinkRepository.deleteByUserId(userId);
      return { removed: true as const };
    }
  },

  getSharedBrain: async (hash: string) => {
    const link = await LinkRepository.findByHash(hash);
    if (!link) return { notFound: true as const };
    const [content, user] = await Promise.all([
      ContentRepository.findByUserId(link.userId.toString()),
      UserRepository.findById(link.userId.toString()),
    ]);
    if (!user) return { userNotFound: true as const };
    return { username: user.username, content };
  },
};
