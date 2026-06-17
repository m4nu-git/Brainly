import { ExternalLink, Pencil, Trash2, Video, AtSign, FileText, File, Link } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useUiStore } from "../../store/ui.store";
import type { Content, ContentType } from "../../types/content.types";

interface ContentCardProps {
  content: Content;
}

const TYPE_CONFIG: Record<
  ContentType,
  { icon: React.ReactNode; label: string; variant: "red" | "blue" | "green" | "amber" | "violet" }
> = {
  youtube: { icon: <Video className="h-4 w-4" />, label: "YouTube", variant: "red" },
  twitter: { icon: <AtSign className="h-4 w-4" />, label: "Twitter", variant: "blue" },
  article: { icon: <FileText className="h-4 w-4" />, label: "Article", variant: "green" },
  document: { icon: <File className="h-4 w-4" />, label: "Document", variant: "amber" },
  link: { icon: <Link className="h-4 w-4" />, label: "Link", variant: "violet" },
};

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}

export function ContentCard({ content }: ContentCardProps) {
  const { openEditContent, openDeleteContent } = useUiStore();
  const typeConfig = TYPE_CONFIG[content.type];
  const thumbnail = content.type === "youtube" ? getYoutubeThumbnail(content.link) : null;

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
      {thumbnail && (
        <div className="relative h-36 overflow-hidden bg-slate-100">
          <img
            src={thumbnail}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={typeConfig.variant} className="flex items-center gap-1 shrink-0">
            {typeConfig.icon}
            {typeConfig.label}
          </Badge>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 mb-1">
            {content.title}
          </h3>
          {content.content && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {content.content}
            </p>
          )}
        </div>

        {content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {content.tags.slice(0, 4).map((tag) => (
              <span
                key={tag._id}
                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
              >
                #{tag.name}
              </span>
            ))}
            {content.tags.length > 4 && (
              <span className="text-xs text-slate-400">+{content.tags.length - 4} more</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open link
          </a>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openEditContent(content)}
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => openDeleteContent(content)}
              title="Delete"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
