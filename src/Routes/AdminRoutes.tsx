import { Routes, Route } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout.tsx";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.tsx";
import { RoutePaths, UserRoles } from "../Constants.ts";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/Store.ts";
import AdminDashboard from "../Pages/Admin/Dashboard/Dashboard.tsx";
import UserPage from "../Pages/Admin/UsersPage/UsersPage.tsx";
import TeamsPage from "../Pages/Admin/TeamsPage/TeamsPage.tsx";
import PlayersPage from "../Pages/Admin/PlayersPage/PlayersPage.tsx";

const AdminRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  return (
    <Routes>
      <Route
        path={RoutePaths.Admin}
        element={
          <ProtectedRoute
            allowedRoles={[UserRoles.Admin]}
            userRoles={[user?.role ?? UserRoles.User]}
          >
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={RoutePaths.Auctions} element={<AdminDashboard />} />
        <Route path={RoutePaths.Dashboard} element={<AdminDashboard />} />
        <Route path={RoutePaths.Users} element={<UserPage/>} />
        <Route path={RoutePaths.Teams} element={<TeamsPage/>} />
        <Route path={RoutePaths.Players} element={<PlayersPage/>} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
