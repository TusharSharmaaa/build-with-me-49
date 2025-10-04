import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Filter } from "lucide-react";
import { useState } from "react";

export interface FilterOptions {
  freeOnly: boolean;
  sortBy: "rating" | "updated" | "name";
  requiresFreeLimit: boolean;
}

interface FilterSheetProps {
  filters: FilterOptions;
  onApply: (filters: FilterOptions) => void;
}

export function FilterSheet({ filters, onApply }: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      freeOnly: false,
      sortBy: "rating",
      requiresFreeLimit: false,
    };
    setLocalFilters(defaultFilters);
    onApply(defaultFilters);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Filter & Sort</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          {/* Pricing Filter */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pricing</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="free-only" className="text-sm font-normal">
                Show only free tools
              </Label>
              <Switch
                id="free-only"
                checked={localFilters.freeOnly}
                onCheckedChange={(checked) =>
                  setLocalFilters({ ...localFilters, freeOnly: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="free-limit" className="text-sm font-normal">
                Must have free usage limit
              </Label>
              <Switch
                id="free-limit"
                checked={localFilters.requiresFreeLimit}
                onCheckedChange={(checked) =>
                  setLocalFilters({ ...localFilters, requiresFreeLimit: checked })
                }
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Sort By</Label>
            <RadioGroup
              value={localFilters.sortBy}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, sortBy: value as any })
              }
            >
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="rating" id="sort-rating" />
                <Label htmlFor="sort-rating" className="font-normal cursor-pointer">
                  Highest Rating
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="updated" id="sort-updated" />
                <Label htmlFor="sort-updated" className="font-normal cursor-pointer">
                  Recently Updated
                </Label>
              </div>
              <div className="flex items-center space-x-2 py-2">
                <RadioGroupItem value="name" id="sort-name" />
                <Label htmlFor="sort-name" className="font-normal cursor-pointer">
                  Name (A-Z)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
