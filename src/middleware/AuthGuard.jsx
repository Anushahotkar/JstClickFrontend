// Import Dependencies
import { Navigate, useLocation, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import {
  GHOST_ENTRY_PATH,
  DASHBOARD_HOME_PATH,
} from "../constants/app.constant";

// ----------------------------------------------------------------------

export default function AuthGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  // Always sanitize "from"
  const safeFrom =
    location?.pathname &&
    location.pathname !== "/" &&
    location.pathname.toLowerCase() !== "null" &&
    location.pathname.toLowerCase() !== "undefined"
      ? location.pathname
      : DASHBOARD_HOME_PATH;

  // 🔹 If NOT logged in → redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={GHOST_ENTRY_PATH}
        state={{ from: safeFrom }}
        replace
      />
    );
  }

  // 🔹 If already logged in and trying to access login page → go to dashboard
  if (isAuthenticated && location.pathname === GHOST_ENTRY_PATH) {
    return <Navigate to={DASHBOARD_HOME_PATH} replace />;
  }

  return <>{outlet}</>;
}
