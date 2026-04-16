"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";
const locations = ["All Locations", "Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"];
const propertyTypes = ["All Types", "apartment", "villa", "house", "penthouse"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "discount", label: "Highest Discount" },
  { value: "ending-soon", label: "Ending Soon" }
];
function PropertyFilters({ filters, onFiltersChange, onReset }) {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  const hasActiveFilters = filters.search || filters.location !== "All Locations" || filters.type !== "All Types" || filters.minPrice > 0 || filters.maxPrice < 1e7 || filters.minBuyers !== "any";
  return <div className="space-y-4">
      {
    /* Desktop Filters */
  }
      <div className="hidden gap-4 lg:flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
    placeholder="Search properties..."
    value={filters.search}
    onChange={(e) => updateFilter("search", e.target.value)}
    className="pl-10"
  />
        </div>
        <Select
    value={filters.location}
    onValueChange={(value) => updateFilter("location", value)}
  >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Select
    value={filters.type}
    onValueChange={(value) => updateFilter("type", value)}
  >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => <SelectItem key={type} value={type} className="capitalize">
                {type === "All Types" ? type : type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Select
    value={filters.sortBy}
    onValueChange={(value) => updateFilter("sortBy", value)}
  >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>)}
          </SelectContent>
        </Select>
        {hasActiveFilters && <Button variant="ghost" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>}
      </div>

      {
    /* Mobile Filters */
  }
      <div className="flex gap-2 lg:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
    placeholder="Search..."
    value={filters.search}
    onChange={(e) => updateFilter("search", e.target.value)}
    className="pl-10"
  />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your property search</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
    value={filters.location}
    onValueChange={(value) => updateFilter("location", value)}
  >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property Type</Label>
                <Select
    value={filters.type}
    onValueChange={(value) => updateFilter("type", value)}
  >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => <SelectItem key={type} value={type} className="capitalize">
                        {type === "All Types" ? type : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label>Price Range (AED)</Label>
                <div className="px-2">
                  <Slider
    value={[filters.minPrice, filters.maxPrice]}
    min={0}
    max={1e7}
    step={1e5}
    onValueChange={([min, max]) => {
      updateFilter("minPrice", min);
      updateFilter("maxPrice", max);
    }}
  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>AED {(filters.minPrice / 1e6).toFixed(1)}M</span>
                  <span>AED {(filters.maxPrice / 1e6).toFixed(1)}M</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
    value={filters.sortBy}
    onValueChange={(value) => updateFilter("sortBy", value)}
  >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && <Button variant="outline" className="w-full bg-transparent" onClick={onReset}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All Filters
                </Button>}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>;
}
export {
  PropertyFilters
};
