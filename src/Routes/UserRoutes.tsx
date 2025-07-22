import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
// import UserLayout from "../Layout/UserLayout";
// import HomePage from "../pages/User/HomePage/HomePage";
// import AuctionPage from "../pages/User/AuctionPage/AuctionPage";
// import UserTeamPage from "../pages/User/UserTeamPage/UserTeamPage";
// import UserAuctionPage from "../pages/User/UserAuctionPage/UserAuctionPage";
// import UserAuctionLivePage from "../pages/User/UserAuctionLivePage/UserAuctionLivePage";
import { RoutePaths } from "../Constants";
import UserLayout from "../Layout/UserLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import HomePage from "../Pages/User/HomePage/HomePage";

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
      {/* <Route path={RoutePaths.UserAuctions} element={<AuctionPage />} />
      <Route path={RoutePaths.UserMyAuctions} element={<UserAuctionPage />} /> */}
      {/* <Route
        path={RoutePaths.UserAuctionLive}
        element={<UserAuctionLivePage />}
      />
      <Route path={RoutePaths.UserTeams} element={<UserTeamPage />} /> */}
    </Route>
  </Routes>
);

export default UserRoutes;
