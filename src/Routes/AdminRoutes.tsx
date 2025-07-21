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
import MatchesPage from "../Pages/Admin/MatchesPage/MatchesPage.tsx";
import ScorePage from "../Pages/Admin/ScorePage/ScorePage.tsx";
import AuctionPage from "../Pages/Admin/AuctionPage/AuctionPage.tsx";

const AdminRoutes = () => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  console.log("authori", user);
  return (
    <Routes>
      <Route
        path={RoutePaths.Admin}
        element={
          <ProtectedRoute allowedRoles={[UserRoles.Admin]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={RoutePaths.Auctions} element={<AuctionPage />} />
        <Route path={RoutePaths.Dashboard} element={<AdminDashboard />} />
        <Route path={RoutePaths.Users} element={<UserPage />} />
        <Route path={RoutePaths.Teams} element={<TeamsPage />} />
        <Route path={RoutePaths.Players} element={<PlayersPage />} />
        <Route path={RoutePaths.Matches} element={<MatchesPage />} />
        <Route path={RoutePaths.ScoringRules} element={<ScorePage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
