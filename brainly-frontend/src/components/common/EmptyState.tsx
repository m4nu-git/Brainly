import { Brain, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useUiStore } from "../../store/ui.store";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
}

export function EmptyState({
  title = "No content yet",
  description = "Start building your second brain by adding your first bookmark.",
  showAction = true,
}: EmptyStateProps) {
  const openAddContent = useUiStore((s) => s.openAddContent);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
        <Brain className="h-8 w-8 text-violet-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      </div>
      {showAction && (
        <Button onClick={openAddContent} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      )}
    </div>
  );
}
