const STOP_WORDS = new Set([
  // English
  "a", "an", "the", "is", "in", "of", "to", "and", "or", "but", "for",
  "at", "by", "with", "about", "from", "as", "this", "that", "these",
  "those", "it", "its", "they", "their", "we", "our", "you", "your",
  "how", "what", "where", "when", "why", "which", "who", "will", "can",
  "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "not", "on", "up", "out", "into", "than", "then",
  "also", "just", "more", "some", "any", "all", "each", "both", "few",
  "many", "much", "so", "too", "very", "get", "new", "use", "used",
  "using", "make", "made", "work", "works", "working", "allow", "allows",
  "provide", "provides", "enable", "enables", "help", "helps", "send",
  "sends", "receive", "receives", "run", "runs", "running", "create",
  "creates", "build", "builds", "built",
  // Domain stop words (per spec)
  "article", "note", "tutorial", "learn", "learning", "thing", "stuff",
  "introduction", "guide", "overview", "beginner", "advanced", "complete",
  "full", "simple", "easy", "quick", "getting", "started", "part",
  "series", "course", "example", "examples", "understanding", "basics",
]);

const TECH_TERMS = new Set([
  // Languages
  "javascript", "typescript", "python", "java", "go", "rust", "ruby",
  "swift", "kotlin", "php", "scala", "elixir", "haskell", "cpp", "csharp",
  // Frontend
  "react", "vue", "angular", "svelte", "html", "css", "tailwind",
  "webpack", "vite", "nextjs", "gatsby", "remix",
  // Backend
  "nodejs", "node", "express", "fastapi", "django", "flask", "spring",
  "rails", "laravel", "nestjs", "fastify", "hono",
  // Databases
  "mongodb", "postgresql", "postgres", "mysql", "sqlite", "redis",
  "elasticsearch", "cassandra", "dynamodb", "supabase",
  // Cloud / DevOps
  "docker", "kubernetes", "aws", "gcp", "azure", "terraform", "github",
  "linux", "nginx", "vercel", "netlify", "ci", "cd",
  // Concepts
  "api", "rest", "graphql", "grpc", "microservices", "serverless",
  "websocket", "oauth", "jwt", "authentication", "authorization",
  "caching", "queue", "pubsub", "streaming", "concurrency", "async",
  // Patterns
  "algorithm", "algorithms", "architecture", "testing", "performance",
  "security", "encryption", "hashing", "indexing", "optimization",
  // AI / ML
  "ai", "ml", "llm", "embedding", "vector", "transformer", "gpt",
  "langchain", "neural", "inference", "training",
  // Messaging / Infra
  "kafka", "rabbitmq", "pubsub", "pub", "sub", "messaging",
  "distributed", "replication", "sharding", "load", "balancing",
]);

const CATEGORY_MAP: Record<string, string[]> = {
  react: ["frontend", "javascript"],
  vue: ["frontend", "javascript"],
  angular: ["frontend", "typescript"],
  svelte: ["frontend", "javascript"],
  nextjs: ["frontend", "react"],
  nodejs: ["backend", "javascript"],
  node: ["backend", "javascript"],
  express: ["backend", "nodejs"],
  fastify: ["backend", "nodejs"],
  nestjs: ["backend", "typescript"],
  django: ["backend", "python"],
  flask: ["backend", "python"],
  fastapi: ["backend", "python"],
  rails: ["backend", "ruby"],
  spring: ["backend", "java"],
  laravel: ["backend", "php"],
  mongodb: ["database", "nosql"],
  postgresql: ["database", "sql"],
  postgres: ["database", "sql"],
  mysql: ["database", "sql"],
  redis: ["database", "caching"],
  elasticsearch: ["database", "search"],
  docker: ["devops", "containerization"],
  kubernetes: ["devops", "orchestration"],
  aws: ["cloud", "devops"],
  gcp: ["cloud", "devops"],
  azure: ["cloud", "devops"],
  graphql: ["api", "backend"],
  pubsub: ["messaging", "distributed-systems"],
  kafka: ["messaging", "distributed-systems"],
  rabbitmq: ["messaging", "distributed-systems"],
  ai: ["machine-learning"],
  ml: ["machine-learning"],
  llm: ["ai", "machine-learning"],
};

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ");
}

function toKebabCase(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function tokenize(text: string): string[] {
  return stripHtml(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export const KeywordExtractor = {
  extract: (title: string, content = ""): string[] => {
    const words = tokenize(`${title} ${content}`).filter(
      (w) => !STOP_WORDS.has(w) && w.length > 2
    );

    const freq: Record<string, number> = {};
    for (const w of words) {
      freq[w] = (freq[w] ?? 0) + (TECH_TERMS.has(w) ? 3 : 1);
    }

    const topTerms = Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([w]) => w);

    const categories = topTerms
      .filter((w) => CATEGORY_MAP[w])
      .flatMap((w) => CATEGORY_MAP[w]);

    return [...new Set([...topTerms, ...categories])]
      .map(toKebabCase)
      .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
      .slice(0, 8);
  },
};
