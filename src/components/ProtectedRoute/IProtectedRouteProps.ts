export interface IProtectedRouteProps {
  userRoles: string[];
  allowedRoles: string[];
  children: React.ReactNode;
}
