import { Navigate } from "react-router-dom";
import { useAuthState } from "../contexts/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { authenticated, loading } = useAuthState();

  if (loading) {
    return null;
  }

  if (authenticated) {
    return children;
  }

  // Storing the url_before_login allows to redirect to the originally requested page
  localStorage.setItem(
    "url_before_login",
    window.location.pathname + window.location.search
  );
  return <Navigate to="/login" />;
}

export default PrivateRoute;
