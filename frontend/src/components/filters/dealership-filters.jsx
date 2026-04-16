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
import { Search, SlidersHorizontal, X } from "lucide-react";
const brands = [
  "All Brands",
  "Toyota",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Nissan",
  "Honda",
  "Land Rover",
  "Audi",
  "Hyundai",
  "Lexus"
];
const cities = ["All Cities", "Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "discount-high", label: "Highest Discount" },
  { value: "rating-high", label: "Highest Rating" },
  { value: "buyers-most", label: "Most Buyers" },
  { value: "ending-soon", label: "Ending Soon" }
];
function DealershipFilters({ filters, onFiltersChange, onReset }) {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };
  const hasActiveFilters = filters.search || filters.brand !== "All Brands" || filters.city !== "All Cities";
  return <div className="space-y-4">
      {
    /* Desktop Filters */
  }
      <div className="hidden gap-4 lg:flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
    placeholder="Search dealerships..."
    value={filters.search}
    onChange={(e) => updateFilter("search", e.target.value)}
    className="pl-10"
  />
        </div>
        <Select
    value={filters.brand}
    onValueChange={(value) => updateFilter("brand", value)}
  >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>)}
          </SelectContent>
        </Select>
        <Select
    value={filters.city}
    onValueChange={(value) => updateFilter("city", value)}
  >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => <SelectItem key={city} value={city}>
                {city}
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
              <SheetDescription>Refine your dealership search</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
    value={filters.brand}
    onValueChange={(value) => updateFilter("brand", value)}
  >
                  <SelectTrigger>
                    <SelectValue placeholder="Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Select
    value={filters.city}
    onValueChange={(value) => updateFilter("city", value)}
  >
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
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
  DealershipFilters
};
