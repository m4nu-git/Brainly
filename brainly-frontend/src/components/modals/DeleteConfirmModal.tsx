import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useContentStore } from "../../store/content.store";
import { useUiStore } from "../../store/ui.store";

export function DeleteConfirmModal() {
  const { deletingContent, closeDeleteContent } = useUiStore();
  const { deleteContent } = useContentStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deletingContent) return;
    setIsDeleting(true);
    try {
      await deleteContent(deletingContent._id);
      toast.success("Content deleted");
      closeDeleteContent();
    } catch {
      toast.error("Failed to delete content");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={!!deletingContent} onOpenChange={closeDeleteContent}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 mb-2">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <DialogTitle>Delete Content</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium text-slate-700">&quot;{deletingContent?.title}&quot;</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteContent} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isDeleting}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
