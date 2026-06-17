import * as React from "react";
import { cn } from "../../utils/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-none",
        "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 focus:border-violet-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-red-400 focus:ring-red-400",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
