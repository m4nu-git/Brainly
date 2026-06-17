import { KeywordExtractor } from "../utils/keywordExtractor";
import { LLMTagGenerator } from "../utils/llmTagGenerator";
import { GeminiTagGenerator } from "../utils/geminiTagGenerator";
import { TagRepository } from "../repositories/tag.repository";

export const AutoTagService = {
  generate: async (
    title: string,
    content: string,
    userId: string
  ): Promise<string[]> => {
    let tagNames: string[];

    if (process.env.GEMINI_API_KEY) {
      tagNames = await GeminiTagGenerator.generate(title, content).catch(() =>
        KeywordExtractor.extract(title, content)
      );
    } else if (process.env.ANTHROPIC_API_KEY) {
      tagNames = await LLMTagGenerator.generate(title, content).catch(() =>
        KeywordExtractor.extract(title, content)
      );
    } else {
      tagNames = KeywordExtractor.extract(title, content);
    }

    if (tagNames.length === 0) return [];
    return TagRepository.upsertMany(tagNames, userId);
  },
};
