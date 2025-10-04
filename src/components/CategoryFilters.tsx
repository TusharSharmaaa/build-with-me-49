import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export type FilterOptions = {
  freeTier: boolean | null;
  sortBy: "rating" | "name" | "recent";
};

interface CategoryFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function CategoryFilters({ onFilterChange, currentFilters }: CategoryFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleFreeTierToggle = (value: boolean | null) => {
    onFilterChange({ ...currentFilters, freeTier: value });
  };

  const handleSortChange = (value: FilterOptions["sortBy"]) => {
    onFilterChange({ ...currentFilters, sortBy: value });
  };

  const hasActiveFilters = currentFilters.freeTier !== null;

  return (
    <div className="flex items-center gap-2">
      {/* Sort Selector - Always Visible */}
      <Select value={currentFilters.sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="recent">Recently Added</SelectItem>
        </SelectContent>
      </Select>

      {/* Filters Button (Mobile Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center rounded-full">
                1
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[60vh]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Pricing</h4>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={currentFilters.freeTier === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleFreeTierToggle(null)}
                >
                  All Tools
                </Badge>
                <Badge
                  variant={currentFilters.freeTier === true ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleFreeTierToggle(true)}
                >
                  Free Tier
                </Badge>
                <Badge
                  variant={currentFilters.freeTier === false ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleFreeTierToggle(false)}
                >
                  Paid Only
                </Badge>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFreeTierToggle(null)}
                className="w-full gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
