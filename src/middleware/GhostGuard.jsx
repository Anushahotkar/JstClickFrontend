// Import Dependencies
import { Navigate, useOutlet } from "react-router";

// Local Imports
import { useAuthContext } from "app/contexts/auth/context";
import { HOME_PATH, REDIRECT_URL_KEY } from "constants/app.constant";

// ----------------------------------------------------------------------

export default function GhostGuard() {
  const outlet = useOutlet();
  const { isAuthenticated } = useAuthContext();

  // Get redirect param safely
  const redirectParam = new URLSearchParams(window.location.search).get(
    REDIRECT_URL_KEY
  );

  // Sanitize redirect URL
  const url =
    redirectParam &&
    redirectParam.trim() !== "" &&
    redirectParam.toLowerCase() !== "null" &&
    redirectParam.toLowerCase() !== "undefined"
      ? redirectParam
      : null;

  if (isAuthenticated) {
    if (url) {
      return <Navigate to={url} replace />;
    }
    return <Navigate to={HOME_PATH} replace />;
  }

  return <>{outlet}</>;
}
