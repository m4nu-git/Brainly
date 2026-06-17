import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700",
        violet: "bg-violet-100 text-violet-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        amber: "bg-amber-100 text-amber-700",
        purple: "bg-purple-100 text-purple-700",
        outline: "border border-slate-200 text-slate-600 bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Badge({ className, variant, children }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
