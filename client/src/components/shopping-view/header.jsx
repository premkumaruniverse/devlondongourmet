
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog, User } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import account from "../../assets/account.jpg";
import londonGourmetLogo from "../../assets/lg_logo.svg";
import ThemeToggle from "../common/theme-toggle";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") &&
    currentFilter !== null &&
    getCurrentMenuItem.path.indexOf("listing") > -1
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <div className="flex flex-wrap md:flex-nowrap md:flex-row flex-col md:items-center gap-4 md:gap-6">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="whitespace-nowrap group relative">
          <button
            onClick={() => handleNavigate(menuItem)}
            className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 tracking-wide text-left z-10"
          >
            <span className="relative z-10">{menuItem.label}</span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
          <span className="absolute inset-0 bg-gradient-to-r from-amber-50 to-white rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105 -z-10 opacity-0 group-hover:opacity-100"></span>
        </div>
      ))}
    </div>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, isAuthenticated, user?.id]);

  console.log(cartItems, "sangam");

  if (!isAuthenticated) {
    // Show login/register buttons for unauthenticated users
    return (
      <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        <Button
          onClick={() => navigate("/auth/login")}
          variant="outline"
          size="sm"
        >
          Sign In
        </Button>
        <Button
          onClick={() => navigate("/auth/register")}
          size="sm"
        >
          Sign Up
        </Button>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-6">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative hover:bg-accent transition-colors duration-200"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartItems?.items?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
              {cartItems.items.length}
            </span>
          )}
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-primary hover:bg-primary/90 transition-colors duration-200 cursor-pointer">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col space-y-6 p-6">
                <Link to="/shop/home" className="flex items-center">
                  <img 
                    src={londonGourmetLogo} 
                    alt="London Gourmet" 
                    className="h-28 w-auto object-contain"
                  />
                  <div className="flex flex-col justify-center -ml-4">
                    <span className="font-playfair text-lg font-bold text-amber-600 dark:text-amber-500 leading-none">
                      London Gourmet
                    </span>
                  </div>
                </Link>
                <nav className="flex flex-col space-y-4">
                  <MenuItems />
                </nav>
                <div className="pt-4 border-t">
                  <HeaderRightContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo - Centered */}
          <div className="flex justify-start mr-12">
            <Link to="/shop/home" className="flex items-center">
              <img 
                src={londonGourmetLogo} 
                alt="London Gourmet" 
                className="h-36 w-auto object-contain"
              />
              <div className="flex flex-col justify-center -ml-4">
                <span className="font-playfair text-xl font-bold text-amber-600 dark:text-amber-500 leading-none">
                  London Gourmet
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex flex-1 justify-center">
            <MenuItems />
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 flex-1 justify-end pl-8">
            <HeaderRightContent />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
