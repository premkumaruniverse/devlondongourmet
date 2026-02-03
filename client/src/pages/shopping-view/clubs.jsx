import ClubFilter from "@/components/shopping-view/club-filter";
import ShoppingClubTile from "@/components/shopping-view/club-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clubSortOptions } from "@/config";
import { fetchAllLiveClubs } from "@/store/shop/clubs-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingClubs() {
  const dispatch = useDispatch();
  const { clubList } = useSelector((state) => state.shopClubs);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get category from URL params
  const categorySearchParam = searchParams.get("category");
  
  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = {};
    
    if (categorySearchParam) {
      initialFilters.experience_type = [categorySearchParam];
    }
    
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [categorySearchParam]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      if (getSectionId === 'experience_type') {
        if (prevFilters.experience_type?.includes(getCurrentOption)) {
          delete newFilters.experience_type;
        } else {
          newFilters.experience_type = [getCurrentOption];
        }
      }
      
      // Update URL with current filters
      const params = new URLSearchParams();
      if (newFilters.experience_type) params.set('category', newFilters.experience_type[0]);
      setSearchParams(params);
      
      // Save to session storage
      sessionStorage.setItem("clubFilters", JSON.stringify(newFilters));
      
      return newFilters;
    });
  }
  
  // Fetch clubs when filters or sort changes
  useEffect(() => {
    dispatch(fetchAllLiveClubs({ 
      category: filters?.experience_type?.[0], 
      sort 
    }));
  }, [filters, sort, dispatch]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("clubFilters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    dispatch(fetchAllLiveClubs({ 
      category: filters.experience_type?.[0], 
      sort 
    }));
  }, [dispatch, sort, filters]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6 dark:bg-background min-h-screen">
      <ClubFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm dark:bg-background dark:border dark:border-border">
        <div className="p-4 border-b flex items-center justify-between dark:border-border">
          <h2 className="text-lg font-extrabold dark:text-primary">Gourmet Clubs</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground dark:text-muted-foreground">
              {clubList?.length} Clubs
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 dark:text-primary dark:border-border dark:hover:bg-primary/10"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] dark:bg-card dark:border-border">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {clubSortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="dark:text-foreground dark:focus:bg-primary/10"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {clubList && clubList.length > 0
            ? clubList.map((clubItem) => (
                <ShoppingClubTile
                  key={clubItem._id}
                  club={clubItem}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default ShoppingClubs;
