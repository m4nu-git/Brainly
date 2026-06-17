import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT = (title: string, content: string) =>
  `Generate 3 to 8 relevant tags for this content. Return ONLY a JSON array of lowercase kebab-case strings. Focus on technology names, frameworks, concepts, and categories. Ignore generic words like "tutorial", "introduction", "article", "learn", "guide".

${content ? `Title: ${title}\nContent: ${content}` : `Title: ${title}`}

Return format: ["tag1", "tag2", "tag3"]`;

export const GeminiTagGenerator = {
  generate: async (title: string, content: string): Promise<string[]> => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(PROMPT(title, content));
    const raw = result.response.text().trim();

    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) throw new Error("Gemini did not return a valid JSON array");

    const parsed = JSON.parse(match[0]) as unknown[];
    return parsed
      .filter((t): t is string => typeof t === "string")
      .map((t) =>
        t
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      )
      .filter((t) => t.length > 0)
      .slice(0, 8);
  },
};
