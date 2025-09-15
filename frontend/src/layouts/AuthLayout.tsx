import { useAuth } from "../hooks/useAuth";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

function AuthLayout() {
  const { data: user, isLoading, isError } = useAuth();
  console.log(user, "user");
  console.log(isError, "is error");
  if (isLoading) {
    return <></>;
  }
  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthLayout;
