import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ContentForm } from "../forms/ContentForm";
import { useContentStore } from "../../store/content.store";
import { useUiStore } from "../../store/ui.store";
import type { ContentFormValues } from "../../schemas/content.schema";
import type { ApiError } from "../../types/api.types";

export function EditContentModal() {
  const { editingContent, closeEditContent } = useUiStore();
  const { updateContent } = useContentStore();

  const handleSubmit = async (values: ContentFormValues) => {
    if (!editingContent) return;
    try {
      await updateContent(editingContent._id, {
        title: values.title,
        link: values.link,
        type: values.type,
        content: values.content,
        tags: values.tags,
      });
      toast.success("Content updated!");
      closeEditContent();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message ?? "Failed to update content";
      toast.error(message);
    }
  };

  return (
    <Dialog open={!!editingContent} onOpenChange={closeEditContent}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Content</DialogTitle>
        </DialogHeader>
        {editingContent && (
          <ContentForm
            editingContent={editingContent}
            onSubmit={handleSubmit}
            onCancel={closeEditContent}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
