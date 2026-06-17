import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { tagSchema, type TagFormValues } from "../../schemas/tags.schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field } from "../ui/field";

interface TagFormProps {
  onSubmit: (values: TagFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TagForm({ onSubmit, onCancel, isSubmitting }: TagFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagFormValues>({ resolver: zodResolver(tagSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Tag name" error={errors.name?.message} required>
        <Input
          {...register("name")}
          placeholder="e.g. react, javascript, backend"
          error={errors.name?.message}
          autoFocus
        />
      </Field>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          Create Tag
        </Button>
      </div>
    </form>
  );
}
