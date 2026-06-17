import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { ContentForm } from "../forms/ContentForm";
import { useContentStore } from "../../store/content.store";
import { useUiStore } from "../../store/ui.store";
import type { ContentFormValues } from "../../schemas/content.schema";
import type { ApiError } from "../../types/api.types";

export function AddContentModal() {
  const { isAddContentOpen, closeAddContent } = useUiStore();
  const { createContent } = useContentStore();

  const handleSubmit = async (values: ContentFormValues) => {
    try {
      await createContent({
        title: values.title,
        link: values.link,
        type: values.type,
        content: values.content,
        tags: values.tags,
      });
      toast.success("Content added successfully!");
      closeAddContent();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const message = error.response?.data?.message ?? "Failed to add content";
      toast.error(message);
    }
  };

  return (
    <Dialog open={isAddContentOpen} onOpenChange={closeAddContent}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Content</DialogTitle>
          <DialogDescription>
            Save a link to your second brain. Tags are auto-generated from your title and notes.
          </DialogDescription>
        </DialogHeader>
        <ContentForm onSubmit={handleSubmit} onCancel={closeAddContent} />
      </DialogContent>
    </Dialog>
  );
}
