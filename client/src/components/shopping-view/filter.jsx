import { filterOptions } from "@/config";
import { Fragment, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [availableSubcategories, setAvailableSubcategories] = useState({});

  // Initialize expanded categories and available subcategories
  useEffect(() => {
    const initialExpanded = {};
    const initialSubcategories = {};
    
    filterOptions.category.forEach(category => {
      initialExpanded[category.id] = false;
      initialSubcategories[category.id] = [];
    });
    
    setExpandedCategories(initialExpanded);
    setAvailableSubcategories(initialSubcategories);
  }, []);

  // Update available subcategories when category is selected
  useEffect(() => {
    if (filters?.category?.[0]) {
      const categoryId = filters.category[0];
      const category = filterOptions.category.find(cat => cat.id === categoryId);
      if (category) {
        setAvailableSubcategories(prev => ({
          ...prev,
          [categoryId]: category.subcategories || []
        }));
        setExpandedCategories(prev => ({
          ...prev,
          [categoryId]: true
        }));
      }
    } else {
      // Reset subcategories when no category is selected
      setAvailableSubcategories({});
    }
  }, [filters?.category]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const isChecked = (type, id) => {
    return filters && filters[type] && filters[type].includes(id);
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-base font-bold mb-2">Categories</h3>
          <div className="space-y-2">
            {filterOptions.category.map((category) => (
              <div key={category.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 font-medium cursor-pointer">
                    <Checkbox
                      checked={isChecked('category', category.id)}
                      onCheckedChange={() => handleFilter('category', category.id)}
                    />
                    {category.label}
                  </Label>
                  {category.subcategories?.length > 0 && (
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                
                {expandedCategories[category.id] && availableSubcategories[category.id]?.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    <h4 className="text-sm font-medium text-gray-600">Subcategories</h4>
                    <div className="space-y-1">
                      {availableSubcategories[category.id].map((subcategory) => (
                        <Label key={subcategory.id} className="flex items-center gap-2 text-sm text-gray-600">
                          <Checkbox
                            checked={isChecked('subcategory', subcategory.id)}
                            onCheckedChange={() => handleFilter('subcategory', subcategory.id)}
                            className="h-3 w-3"
                          />
                          {subcategory.label}
                        </Label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilter;
