import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
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

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  // Get category and subcategory from URL params
  const categorySearchParam = searchParams.get("category");
  const subcategorySearchParam = searchParams.get("subcategory");
  
  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = {};
    
    if (categorySearchParam) {
      initialFilters.category = [categorySearchParam];
    }
    
    if (subcategorySearchParam) {
      initialFilters.subcategory = [subcategorySearchParam];
    }
    
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [categorySearchParam, subcategorySearchParam]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      
      // If selecting a category, clear subcategory filters
      if (getSectionId === 'category') {
        // If clicking the same category, deselect it
        if (prevFilters.category?.includes(getCurrentOption)) {
          delete newFilters.category;
          // Also clear subcategory if it exists
          if (newFilters.subcategory) {
            delete newFilters.subcategory;
          }
        } else {
          // Select new category and clear any existing subcategory
          newFilters.category = [getCurrentOption];
          delete newFilters.subcategory;
        }
      } 
      // Handle subcategory selection
      else if (getSectionId === 'subcategory') {
        if (!newFilters.category) return prevFilters; // Shouldn't happen, but just in case
        
        const subcategoryIndex = newFilters.subcategory?.indexOf(getCurrentOption) ?? -1;
        
        if (subcategoryIndex === -1) {
          // Add subcategory
          newFilters.subcategory = [getCurrentOption];
        } else {
          // Remove subcategory if clicked again
          if (newFilters.subcategory.length === 1) {
            delete newFilters.subcategory;
          } else {
            newFilters.subcategory.splice(subcategoryIndex, 1);
          }
        }
      }
      
      // Update URL with current filters
      const params = new URLSearchParams();
      if (newFilters.category) params.set('category', newFilters.category[0]);
      if (newFilters.subcategory) params.set('subcategory', newFilters.subcategory?.[0]);
      setSearchParams(params);
      
      // Save to session storage
      sessionStorage.setItem("filters", JSON.stringify(newFilters));
      
      return newFilters;
    });
  }
  
  // Fetch products when filters or sort changes
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    // Add category filter if exists
    if (filters?.category?.length > 0) {
      queryParams.append('category', filters.category[0]);
    }
    
    // Add subcategory filter if exists
    if (filters?.subcategory?.length > 0) {
      queryParams.append('subcategory', filters.subcategory[0]);
    }
    
    // Add sort if exists
    if (sort) {
      queryParams.append('sort', sort);
    }
    
    // Fetch products with filters
    dispatch(fetchAllFilteredProducts(queryParams.toString()));
  }, [filters, sort, dispatch, setSearchParams]);

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    const hasUrlFilters = Boolean(categorySearchParam) || Boolean(subcategorySearchParam);
    if (hasUrlFilters) {
      const stored = JSON.parse(sessionStorage.getItem("filters")) || {};
      setFilters(stored);
    } else {
      setFilters({});
    }
  }, [categorySearchParam, subcategorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(productList, "productListproductListproductList");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
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
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
