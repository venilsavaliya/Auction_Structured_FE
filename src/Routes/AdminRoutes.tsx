import { Routes, Route } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout.jsx"
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.js";
import { UserRoles } from "../Constants.js";
// // import AdminDashboard from "../";
// import AdminDashboard from "../pages/Admin/AdminDasboard/AdminDashboard.jsx";
// import ProtectedRoute from "../components/ProtectedRoute";


const AdminRoutes = () => (
  <Routes>
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={[UserRoles.Admin]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="dashboard" element={<AdminDashboard />} />
     
    </Route>
  </Routes>
);

export default AdminRoutes;
