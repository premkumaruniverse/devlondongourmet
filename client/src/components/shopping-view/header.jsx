
import { LogOut, Menu, Search, ShoppingCart, UserCog, User } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
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

  function handleNavigate(getCurrentMenuItem) {
    if (getCurrentMenuItem.id === "products") {
      sessionStorage.removeItem("filters");
    }
    navigate(getCurrentMenuItem.path);
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 xl:gap-4">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <div key={menuItem.id} className="whitespace-nowrap group relative">
          {menuItem.isIcon ? (
            // Icon-only button for Search — saves navbar space
            <button
              onClick={() => handleNavigate(menuItem)}
              className="relative flex items-center justify-center w-8 h-8 rounded-full text-gray-700 dark:text-primary hover:text-gray-900 dark:hover:text-primary/80 hover:bg-amber-50 dark:hover:bg-primary/10 transition-all duration-200 z-10"
              aria-label={menuItem.label}
            >
              <Search className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleNavigate(menuItem)}
              className="relative text-sm font-medium text-gray-700 dark:text-primary hover:text-gray-900 dark:hover:text-primary/80 transition-all duration-300 tracking-wide text-left z-10"
            >
              <span className="relative z-10">{menuItem.label}</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 dark:from-primary dark:to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </button>
          )}
          {!menuItem.isIcon && (
            <span className="absolute inset-0 bg-gradient-to-r from-amber-50 to-white dark:from-primary/10 dark:to-primary/5 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105 -z-10 opacity-0 group-hover:opacity-100"></span>
          )}
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


  if (!isAuthenticated) {
    // Single Account button with dropdown for Sign In / Sign Up
    return (
      <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 flex items-center gap-2 px-4"
            >
              <User className="w-4 h-4" />
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-44">
            <DropdownMenuItem onClick={() => navigate("/auth/login")}>
              <User className="mr-2 h-4 w-4" />
              Sign In
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/auth/register")}>
              <UserCog className="mr-2 h-4 w-4" />
              Sign Up
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background/95 backdrop-blur-md border-b border-gray-100 dark:border-border transition-colors duration-300">
      <div className="w-full px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 flex items-center justify-start gap-4">
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
                    <div className="flex flex-row justify-center ml-2">
                      <span className="font-playfair text-lg font-bold text-amber-600 dark:text-amber-500 leading-none whitespace-nowrap">
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

            {/* Desktop Logo */}
            <div className="hidden md:flex">
              <Link to="/shop/home" className="flex items-center">
                <img
                  src={londonGourmetLogo}
                  alt="London Gourmet"
                  className="h-32 w-auto object-contain"
                />
                <div className="flex flex-row justify-center ml-2">
                  <span className="font-playfair text-xl font-bold text-amber-600 dark:text-amber-500 leading-none whitespace-nowrap">
                    London Gourmet
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex justify-center flex-shrink-0">
            <MenuItems />
          </nav>

          {/* Right side actions */}
          <div className="flex-1 flex items-center justify-end space-x-4">
            <HeaderRightContent />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
