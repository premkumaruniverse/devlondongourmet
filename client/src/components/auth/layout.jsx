import { Outlet } from "react-router-dom";
import londonGourmetLogo from "../../assets/lg_logo.svg";
import { ChefHat, Utensils, Wine } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex relative items-center justify-center w-1/2 px-12 bg-amber-50 dark:bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-transparent dark:from-primary/10 dark:to-transparent" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-200/40 dark:bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-amber-300/40 dark:bg-primary/10 blur-3xl" />
        <div className="relative max-w-md space-y-6 text-center">
          <img
            src={londonGourmetLogo}
            alt="London Gourmet"
            className="h-24 w-auto mx-auto"
          />
          <h1 className="text-4xl md:text-5xl font-playfair font-extrabold tracking-tight text-amber-700 dark:text-primary">
            Welcome to London Gourmet
          </h1>
          <p className="text-lg text-gray-700 dark:text-foreground">
            Fine dining, gourmet products, and curated culinary experiences
          </p>
          <div className="mt-6 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <ChefHat className="w-8 h-8 text-amber-600 dark:text-primary" />
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-foreground">
                Chef-crafted
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Utensils className="w-8 h-8 text-amber-600 dark:text-primary" />
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-foreground">
                Fine dining
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Wine className="w-8 h-8 text-amber-600 dark:text-primary" />
              <span className="mt-2 text-sm font-medium text-gray-700 dark:text-foreground">
                Pairings
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
