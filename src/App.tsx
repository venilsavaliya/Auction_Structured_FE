import { Route, Routes } from "react-router-dom";
import "./App.css";
import { RoutePaths } from "./Constants";
import LoginPage from "./Pages/Auth/LoginPage";

function App() {
  return (
    <Routes>
      <Route
        key={RoutePaths.Login}
        path={RoutePaths.Login}
        element={<LoginPage />}
      />
    </Routes>
  );
}

export default App;
