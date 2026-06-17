import Anthropic from "@anthropic-ai/sdk";

const PROMPT = (title: string, content: string) =>
  `Generate 3 to 8 relevant tags for this content. Return ONLY a JSON array of lowercase kebab-case strings. Focus on technology names, frameworks, concepts, and categories. Ignore generic words like "tutorial", "introduction", "article", "learn", "guide".

${content ? `Title: ${title}\nContent: ${content}` : `Title: ${title}`}

Return format: ["tag1", "tag2", "tag3"]`;

export const LLMTagGenerator = {
  generate: async (title: string, content: string): Promise<string[]> => {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [{ role: "user", content: PROMPT(title, content) }],
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected LLM response type");

    const match = block.text.trim().match(/\[[\s\S]*\]/);
    if (!match) throw new Error("LLM did not return a valid JSON array");

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
