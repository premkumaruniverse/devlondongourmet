import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Link } from "react-router-dom";
import londonGourmetLogo from "../../assets/lg_logo.svg";
import ThemeToggle from "../common/theme-toggle";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-background dark:bg-gray-900 border-b dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center space-x-3">
        <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link to="/admin/dashboard" className="flex items-center">
          <img 
            src={londonGourmetLogo} 
            alt="London Gourmet Admin" 
            className="h-28 w-auto object-contain"
          />
          <div className="flex flex-col justify-center -ml-4">
            <span className="font-playfair text-lg font-bold text-amber-600 dark:text-amber-500 leading-none">
              London Gourmet Admin
            </span>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 justify-end">
        <ThemeToggle />
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
