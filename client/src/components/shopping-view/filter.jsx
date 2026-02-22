import { filterOptions } from "@/config";
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";

function ProductFilter({ filters, handleFilter, onClearAll }) {
  // Track which category accordions are open
  const [expanded, setExpanded] = useState({});

  // Auto-expand a category if it's currently selected (e.g. navigated from home page)
  useEffect(() => {
    if (filters?.category?.[0]) {
      setExpanded((prev) => ({ ...prev, [filters.category[0]]: true }));
    }
  }, [filters?.category]);

  const toggleExpand = (categoryId) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const isCategoryChecked = (categoryId) =>
    filters?.category?.includes(categoryId) ?? false;

  const isSubcategoryChecked = (subcategoryId) =>
    filters?.subcategory?.includes(subcategoryId) ?? false;

  // Count total active filters
  const activeCount =
    (filters?.category?.length ?? 0) + (filters?.subcategory?.length ?? 0);

  return (
    <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      {/* ── Filter Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold tracking-wide">Filters</h2>
          {activeCount > 0 && (
            <Badge className="bg-primary text-primary-foreground text-[11px] h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* ── Active Filter Pills ── */}
      {activeCount > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1.5 border-b border-border bg-muted/30">
          {filters?.category?.map((catId) => {
            const cat = filterOptions.category.find((c) => c.id === catId);
            return (
              <button
                key={catId}
                onClick={() => handleFilter("category", catId)}
                className="flex items-center gap-1 text-[11px] font-medium bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 hover:opacity-80 transition-opacity"
              >
                {cat?.label}
                <X className="h-2.5 w-2.5" />
              </button>
            );
          })}
          {filters?.subcategory?.map((subId) => {
            let subLabel = subId;
            filterOptions.category.forEach((cat) => {
              const found = cat.subcategories?.find((s) => s.id === subId);
              if (found) subLabel = found.label;
            });
            return (
              <button
                key={subId}
                onClick={() => handleFilter("subcategory", subId)}
                className="flex items-center gap-1 text-[11px] font-medium bg-secondary text-secondary-foreground border border-border rounded-full px-2.5 py-0.5 hover:opacity-80 transition-opacity"
              >
                {subLabel}
                <X className="h-2.5 w-2.5" />
              </button>
            );
          })}
        </div>
      )}

      {/* ── Categories ── */}
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Categories
        </p>
        <div className="space-y-1">
          {filterOptions.category.map((category) => {
            const isChecked = isCategoryChecked(category.id);
            const isOpen = expanded[category.id] ?? false;
            const hasSubs = category.subcategories?.length > 0;
            const activeSubCount = category.subcategories?.filter((s) =>
              isSubcategoryChecked(s.id)
            ).length ?? 0;

            return (
              <div key={category.id}>
                {/* Category row */}
                <div
                  className={`flex items-center justify-between rounded-lg px-3 py-2 transition-colors cursor-pointer group ${isChecked
                      ? "bg-primary/10 dark:bg-primary/15"
                      : "hover:bg-muted/50"
                    }`}
                >
                  {/* Checkbox + label */}
                  <label className="flex items-center gap-3 flex-1 cursor-pointer select-none">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={isChecked}
                      onCheckedChange={() =>
                        handleFilter("category", category.id)
                      }
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span
                      className={`text-sm font-medium leading-tight ${isChecked ? "text-primary" : "text-foreground"
                        }`}
                    >
                      {category.label}
                    </span>
                    {activeSubCount > 0 && (
                      <span className="ml-auto text-[10px] font-semibold bg-primary/20 text-primary rounded-full px-1.5 py-0.5">
                        {activeSubCount}
                      </span>
                    )}
                  </label>

                  {/* Expand chevron */}
                  {hasSubs && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(category.id);
                      }}
                      className="ml-2 p-0.5 rounded text-muted-foreground hover:text-primary transition-colors"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories — animated accordion */}
                {hasSubs && isOpen && (
                  <div className="ml-6 mt-1 mb-1 space-y-0.5 border-l-2 border-border pl-3">
                    {category.subcategories.map((sub) => {
                      const subChecked = isSubcategoryChecked(sub.id);
                      return (
                        <label
                          key={sub.id}
                          className={`flex items-center gap-2.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors select-none ${subChecked
                              ? "bg-primary/10 dark:bg-primary/15"
                              : "hover:bg-muted/40"
                            }`}
                        >
                          <Checkbox
                            id={`sub-${sub.id}`}
                            checked={subChecked}
                            onCheckedChange={() =>
                              handleFilter("subcategory", sub.id)
                            }
                            className="h-3.5 w-3.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span
                            className={`text-xs leading-tight ${subChecked
                                ? "text-primary font-semibold"
                                : "text-muted-foreground"
                              }`}
                          >
                            {sub.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
