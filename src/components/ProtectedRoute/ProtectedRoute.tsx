import { useSelector } from "react-redux";
import UnauthorizedPage from "../../Pages/UnAuthorized/UnAuthorizedPage";
import type { IProtectedRouteProps } from "./IProtectedRouteProps";
import type { RootState } from "../../Redux/Store";
import { UserRoles } from "../../Constants";
import Loading from "../Loading/Loading";
const ProtectedRoute = ({
  allowedRoles,
  children,
}: IProtectedRouteProps) => {

  const user = useSelector((state:RootState) => state.auth.currentUser)
  if(user == null)
  {
    return <Loading/>
  }
  const hasAccess = [user?.role??UserRoles.Guest].some((role) => allowedRoles.includes(role));
  if (!hasAccess) {
    return <UnauthorizedPage />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;
