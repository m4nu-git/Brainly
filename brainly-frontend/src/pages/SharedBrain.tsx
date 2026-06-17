import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Brain, ExternalLink, Video, AtSign, FileText, File, Link as LinkIcon } from "lucide-react";
import { brainService } from "../services/api/brain.service";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { ROUTES } from "../constants/routes";
import type { SharedBrainResponse } from "../types/brain.types";
import type { Content, ContentType } from "../types/content.types";

const TYPE_CONFIG: Record<
  ContentType,
  { icon: React.ReactNode; label: string; variant: "red" | "blue" | "green" | "amber" | "violet" }
> = {
  youtube: { icon: <Video className="h-4 w-4" />, label: "YouTube", variant: "red" },
  twitter: { icon: <AtSign className="h-4 w-4" />, label: "Twitter", variant: "blue" },
  article: { icon: <FileText className="h-4 w-4" />, label: "Article", variant: "green" },
  document: { icon: <File className="h-4 w-4" />, label: "Document", variant: "amber" },
  link: { icon: <LinkIcon className="h-4 w-4" />, label: "Link", variant: "violet" },
};

function SharedContentCard({ content }: { content: Content }) {
  const typeConfig = TYPE_CONFIG[content.type];

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-4 gap-3">
      <Badge variant={typeConfig.variant} className="flex items-center gap-1 self-start">
        {typeConfig.icon}
        {typeConfig.label}
      </Badge>

      <div>
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">
          {content.title}
        </h3>
        {content.content && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{content.content}</p>
        )}
      </div>

      {Array.isArray(content.tags) && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {content.tags.slice(0, 4).map((tag) => (
            <span
              key={typeof tag === "string" ? tag : tag._id}
              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
            >
              #{typeof tag === "string" ? tag : tag.name}
            </span>
          ))}
        </div>
      )}

      <a
        href={content.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 font-medium mt-auto pt-2 border-t border-slate-100"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        Open link
      </a>
    </div>
  );
}

export function SharedBrain() {
  const { shareLink } = useParams<{ shareLink: string }>();
  const [data, setData] = useState<SharedBrainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareLink) return;
    brainService
      .getSharedBrain(shareLink)
      .then((res) => setData(res.data))
      .catch((err) => {
        const status = err?.response?.status;
        setError(status === 404 ? "This brain doesn't exist or the share link has been revoked." : "Failed to load brain.");
      })
      .finally(() => setIsLoading(false));
  }, [shareLink]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-violet-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link to={ROUTES.SIGN_IN} className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-slate-900">Brainly</span>
          </Link>
          <Link
            to={ROUTES.SIGN_UP}
            className="text-sm text-violet-600 font-medium hover:text-violet-700"
          >
            Create your own brain →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64 mb-8" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          </>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <Brain className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Brain Not Found</h2>
            <p className="text-sm text-slate-500 max-w-sm">{error}</p>
            <Link
              to={ROUTES.SIGN_IN}
              className="text-sm text-violet-600 font-medium hover:text-violet-700"
            >
              ← Back to Brainly
            </Link>
          </div>
        ) : data ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                {data.username}&apos;s Brain
              </h1>
              <p className="text-slate-500 mt-1">
                {data.content.length} item{data.content.length !== 1 ? "s" : ""} saved
              </p>
            </div>

            {data.content.length === 0 ? (
              <div className="text-center py-16 text-slate-500">This brain is empty.</div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {data.content.map((item) => (
                  <SharedContentCard key={item._id} content={item} />
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
