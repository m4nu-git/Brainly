import { Skeleton } from "../ui/skeleton";

export function ContentCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-200 p-4 gap-3">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}
