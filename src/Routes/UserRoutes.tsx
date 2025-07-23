import { Routes, Route } from "react-router-dom";

import { RoutePaths } from "../Constants";
import UserLayout from "../Layout/UserLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import HomePage from "../Pages/User/HomePage/HomePage";
import AuctionPage from "../Pages/User/AuctionPage/AuctionPage";
import UserAuctionPage from "../Pages/User/UsersAuctionPage/UserAuctionPage";
import UserAuctionLivePage from "../Pages/User/UserAuctionLivePage/UserAuctionLivePage";
import UserTeamPage from "../Pages/User/UserTeamPage/UserTeamPage";
import MatchesPage from "../Pages/User/MatchesPage/MatchesPage";

const UserRoutes = () => (
  <Routes>
    <Route
      path={RoutePaths.User}
      element={
        <ProtectedRoute allowedRoles={["Admin", "Manager", "User"]}>
          <UserLayout />
        </ProtectedRoute>
      }
    >
      <Route path={RoutePaths.UserHomeFull} element={<HomePage/>} />
      <Route path={RoutePaths.UserAuctions} element={<AuctionPage/>} />
      <Route path={RoutePaths.UserMyAuctions} element={<UserAuctionPage />} />
      <Route
        path={RoutePaths.UserAuctionLive}
        element={<UserAuctionLivePage/>}
      />
      <Route path={RoutePaths.UserTeams} element={<UserTeamPage />} />
      <Route path={RoutePaths.UserMatches} element={<MatchesPage />} />
    </Route>
  </Routes>
);

export default UserRoutes;
