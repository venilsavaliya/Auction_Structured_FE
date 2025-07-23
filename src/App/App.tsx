import { Route, Routes } from "react-router-dom";

import { RoutePaths } from "../Constants";
import LoginPage from "../Pages/Auth/LoginPage/LoginPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import currentUserService  from "../Services/Authentication/CurrentUserService";
import { CLEAR_AUTH_LOADING, SET_AUTH_LOADING, SET_CURRENT_USER } from "../Redux/Auth/AuthActionTypes";
import AdminRoutes from "../Routes/AdminRoutes";
import UserRoutes from "../Routes/UserRoutes";
import { ToastContainer } from "react-toastify";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
          dispatch({type:SET_AUTH_LOADING});
          try {
            const res = await currentUserService.GetCurrentUser();
            
            dispatch({ type: SET_CURRENT_USER, payload: res });
          } catch {
            // handle error
          }
          finally{
            dispatch({type:CLEAR_AUTH_LOADING})
          }
        };
        fetchUser();
      }, []);
    
  return (
    <>
     <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    <Routes>
      <Route
        key={RoutePaths.Login}
        path={RoutePaths.Login}
        element={<LoginPage />}
      />
    </Routes>
    <AdminRoutes/>
    <UserRoutes/>
    </>
    
  );
}

export default App;
