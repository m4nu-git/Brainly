import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import { contentSchema, CONTENT_TYPES, type ContentFormValues } from "../../schemas/content.schema";
import { useTagsStore } from "../../store/tags.store";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Content } from "../../types/content.types";

interface ContentFormProps {
  defaultValues?: Partial<ContentFormValues>;
  editingContent?: Content | null;
  onSubmit: (values: ContentFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  youtube: "YouTube",
  twitter: "Twitter",
  article: "Article",
  document: "Document",
  link: "Link",
};

export function ContentForm({
  defaultValues,
  editingContent,
  onSubmit,
  onCancel,
  isSubmitting,
}: ContentFormProps) {
  const { tags, fetchTags } = useTagsStore();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: defaultValues ?? {
      title: editingContent?.title ?? "",
      link: editingContent?.link ?? "",
      type: editingContent?.type,
      content: editingContent?.content ?? "",
      tags: editingContent?.tags.map((t) => t._id) ?? [],
    },
  });

  const selectedTags = watch("tags") ?? [];

  const toggleTag = (tagId: string) => {
    const current = selectedTags;
    if (current.includes(tagId)) {
      setValue("tags", current.filter((id) => id !== tagId));
    } else {
      setValue("tags", [...current, tagId]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Title" error={errors.title?.message} required>
        <Input
          {...register("title")}
          placeholder="e.g. Understanding React Server Components"
          error={errors.title?.message}
        />
      </Field>

      <Field label="URL" error={errors.link?.message} required>
        <Input
          {...register("link")}
          placeholder="https://..."
          error={errors.link?.message}
        />
      </Field>

      <Field label="Type" error={errors.type?.message} required>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger error={!!errors.type}>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field label="Notes / Description" error={errors.content?.message}>
        <Textarea
          {...register("content")}
          placeholder="Add notes or a description..."
          rows={3}
          error={errors.content?.message}
        />
      </Field>

      {tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag._id);
              return (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    isSelected
                      ? "bg-violet-100 border-violet-300 text-violet-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {tag.name}
                  {isSelected && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedTags.length > 0 && tags.length === 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((id) => (
            <Badge key={id} variant="violet">
              {id}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {editingContent ? "Save Changes" : "Add Content"}
        </Button>
      </div>
    </form>
  );
}
