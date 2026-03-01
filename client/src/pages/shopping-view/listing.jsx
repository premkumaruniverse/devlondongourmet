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
import { filterOptions, sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");
  const subcategorySearchParam = searchParams.get("subcategory");

  // ── Initialise filters from URL params (e.g. clicking category card on home page) ──
  useEffect(() => {
    const initial = {};
    if (categorySearchParam) initial.category = [categorySearchParam];
    if (subcategorySearchParam) initial.subcategory = [subcategorySearchParam];
    setFilters(initial);
  }, [categorySearchParam, subcategorySearchParam]);

  // ── Sync URL whenever filters change ──
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters?.category?.[0]) params.set("category", filters.category[0]);
    if (filters?.subcategory?.[0]) params.set("subcategory", filters.subcategory[0]);
    setSearchParams(params, { replace: true });
  }, [filters]);

  // ── Fetch products whenever filters or sort change ──
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
    );
  }, [dispatch, filters, sort]);

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    setFilters((prevFilters) => {
      const next = { ...prevFilters };

      if (getSectionId === "category") {
        const alreadyChecked = prevFilters.category?.includes(getCurrentOption);
        if (alreadyChecked) {
          // Deselect category → also clear its subcategories
          delete next.category;
          // Only clear subcategory if it belongs to the deselected category
          const deselected = filterOptions.category.find(
            (c) => c.id === getCurrentOption
          );
          const deselectedSubIds = deselected?.subcategories?.map((s) => s.id) ?? [];
          if (
            next.subcategory &&
            deselectedSubIds.includes(next.subcategory[0])
          ) {
            delete next.subcategory;
          }
        } else {
          // Select new category, clear stale subcategory from old category
          next.category = [getCurrentOption];
          // Keep subcategory only if it belongs to the newly selected category
          const newCat = filterOptions.category.find(
            (c) => c.id === getCurrentOption
          );
          const validSubIds = newCat?.subcategories?.map((s) => s.id) ?? [];
          if (
            next.subcategory &&
            !validSubIds.includes(next.subcategory[0])
          ) {
            delete next.subcategory;
          }
        }
      } else if (getSectionId === "subcategory") {
        const alreadyChecked = prevFilters.subcategory?.includes(getCurrentOption);

        if (alreadyChecked) {
          // Deselect subcategory — keep category intact
          delete next.subcategory;
        } else {
          // Select subcategory → auto-check the parent category if not already checked
          const parentCat = filterOptions.category.find((cat) =>
            cat.subcategories?.some((s) => s.id === getCurrentOption)
          );
          if (parentCat && !next.category?.includes(parentCat.id)) {
            next.category = [parentCat.id];
          }
          next.subcategory = [getCurrentOption];
        }
      }

      return next;
    });
  }

  function handleClearAll() {
    setFilters({});
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated) {
      toast({ title: "Please sign in to add items to your cart" });
      navigate("/auth/login");
      return;
    }
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
        toast({ title: "Product is added to cart" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  // Determine active category label for display header
  const activeCategoryLabel = filters?.category?.[0]
    ? filterOptions.category.find((c) => c.id === filters.category[0])?.label
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 p-4 md:p-6">
      {/* ── Filter Sidebar ── */}
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        onClearAll={handleClearAll}
      />

      {/* ── Product Grid ── */}
      <div className="bg-background w-full rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold leading-tight">
              {activeCategoryLabel ?? "All Products"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {productList?.length ?? 0} product
              {(productList?.length ?? 0) !== 1 ? "s" : ""} found
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
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

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-base font-semibold text-muted-foreground">
                No products found
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Try adjusting your filters or clearing them
              </p>
            </div>
          )}
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
