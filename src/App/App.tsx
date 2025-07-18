import { Route, Routes } from "react-router-dom";

import { RoutePaths } from "../Constants";
import LoginPage from "../Pages/Auth/LoginPage/LoginPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import currentUserService  from "../Services/Authentication/CurrentUserService";
import { SET_CURRENT_USER } from "../Redux/Auth/AuthActionTypes";
import AdminRoutes from "../Routes/AdminRoutes";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const res = await currentUserService.GetCurrentUser();
            console.log(res);
            
            dispatch({ type: SET_CURRENT_USER, payload: res });
          } catch {
            // handle error
          }
        };
        fetchUser();
      }, []);
    
  return (
    <>
    <Routes>
      <Route
        key={RoutePaths.Login}
        path={RoutePaths.Login}
        element={<LoginPage />}
      />
    </Routes>
    <AdminRoutes/>
    </>
    
  );
}

export default App;
