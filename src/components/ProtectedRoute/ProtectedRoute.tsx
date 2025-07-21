import { useSelector } from "react-redux";
import UnauthorizedPage from "../../Pages/UnAuthorized/UnAuthorizedPage";
import type { IProtectedRouteProps } from "./IProtectedRouteProps";
import type { RootState } from "../../Redux/Store";
import { UserRoles } from "../../Constants";
const ProtectedRoute = ({
  allowedRoles,
  children,
}: IProtectedRouteProps) => {

  const user = useSelector((state:RootState) => state.auth.currentUser)
  const hasAccess = [user?.role??UserRoles.Guest].some((role) => allowedRoles.includes(role));
  if (!hasAccess) {
    return <UnauthorizedPage />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;
