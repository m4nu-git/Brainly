import { useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { AddTagModal } from "../components/modals/AddTagModal";
import { useTagsStore } from "../store/tags.store";
import { useUiStore } from "../store/ui.store";

export function Tags() {
  const { tags, isLoading, fetchTags, deleteTag } = useTagsStore();
  const { openAddTag } = useUiStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteTag(id);
      toast.success(`Tag "${name}" deleted`);
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your tags to organize content
          </p>
        </div>
        <Button onClick={openAddTag} className="gap-2">
          <Plus className="h-4 w-4" />
          New Tag
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <TagIcon className="h-7 w-7 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">No tags yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              Create tags to organize your content. Tags are also auto-generated when you add content.
            </p>
          </div>
          <Button onClick={openAddTag} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Tag
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-4 py-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                  <TagIcon className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <span className="font-medium text-slate-900">{tag.name}</span>
                  <p className="text-xs text-slate-400 font-mono">{tag._id}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(tag._id, tag.name)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                title="Delete tag"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <p className="text-xs text-slate-400 text-center mt-2">
            {tags.length} tag{tags.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <AddTagModal />
    </div>
  );
}
