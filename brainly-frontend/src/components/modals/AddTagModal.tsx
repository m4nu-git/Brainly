import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { TagForm } from "../forms/TagForm";
import { useTagsStore } from "../../store/tags.store";
import { useUiStore } from "../../store/ui.store";
import type { TagFormValues } from "../../schemas/tags.schema";
import type { ApiError } from "../../types/api.types";

export function AddTagModal() {
  const { isAddTagOpen, closeAddTag } = useUiStore();
  const { createTag } = useTagsStore();

  const handleSubmit = async (values: TagFormValues) => {
    try {
      await createTag(values.name);
      toast.success(`Tag "${values.name}" created!`);
      closeAddTag();
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const status = error.response?.status;
      if (status === 409) {
        toast.error("Tag already exists");
      } else {
        toast.error(error.response?.data?.message ?? "Failed to create tag");
      }
    }
  };

  return (
    <Dialog open={isAddTagOpen} onOpenChange={closeAddTag}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Tag</DialogTitle>
        </DialogHeader>
        <TagForm onSubmit={handleSubmit} onCancel={closeAddTag} />
      </DialogContent>
    </Dialog>
  );
}
