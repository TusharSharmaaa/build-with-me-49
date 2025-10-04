import { ReactNode, useEffect, useState, useRef } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  emptyState?: ReactNode;
}

export function VirtualList<T>({
  items,
  itemsPerPage = 12,
  renderItem,
  className = "",
  emptyState,
}: VirtualListProps<T>) {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const displayedItems = items.slice(0, page * itemsPerPage);
  const hasMore = displayedItems.length < items.length;

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setPage((p) => p + 1);
            setIsLoading(false);
          }, 300);
        }
      },
      { threshold: 0.75 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  // Reset pagination when items change
  useEffect(() => {
    setPage(1);
  }, [items]);

  if (items.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={className}>
      {displayedItems.map((item, index) => renderItem(item, index))}
      {hasMore && (
        <div ref={sentinelRef} className="h-20 flex items-center justify-center">
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          )}
        </div>
      )}
    </div>
  );
}
