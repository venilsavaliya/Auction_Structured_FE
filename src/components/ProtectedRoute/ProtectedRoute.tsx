import UnauthorizedPage from '../../Pages/UnAuthorized/UnAuthorizedPage';
import type { IProtectedRouteProps } from './IProtectedRouteProps';

const ProtectedRoute = ({ userRoles, allowedRoles, children }:IProtectedRouteProps) => {
  const hasAccess = userRoles.some(role => allowedRoles.includes(role));
  if (!hasAccess) {
    return <UnauthorizedPage />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;