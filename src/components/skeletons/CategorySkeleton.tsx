import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CategorySkeleton() {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    </Card>
  );
}
