import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  // Redirect authenticated users from auth pages to appropriate dashboard
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Redirect from root to shop/home for better UX
  if (location.pathname === "/") {
    return <Navigate to="/shop/home" />;
  }

  // Protect admin routes - require authentication and admin role
  if (location.pathname.includes("admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" />;
    }
  }

  // Redirect admin users away from shopping pages to admin dashboard
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Allow all other routes (including shopping pages for unauthenticated users)
  return <>{children}</>;
}

export default CheckAuth;