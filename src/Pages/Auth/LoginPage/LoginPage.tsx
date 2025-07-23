// import { useState, type FormEvent } from "react";
// import type { ILoginPageProps } from "./ILoginPageProps";
// import {
//   TextField,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Paper,
//   Typography,
//   Stack,
// } from "@mui/material";
import loginService  from "../../../Services/Authentication/LoginService";
import type { LoginRequestModel } from "../../../Models/RequestModels/LoginRequestModel";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// function LoginPage(_props: ILoginPageProps) {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [rememberMe, setRememberMe] = useState<boolean>(false);

//   const navigate = useNavigate();

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     handleLogin();
//   };

//   const handleLogin = async () => {
//     const loginService = new LoginService();

//     const request: LoginRequestModel = { email, password, rememberMe };

//     const response = await loginService.Login(request);

//     console.log(response);

//     if (response.isSuccess) {
//       const decoded: any = jwtDecode(response.accessToken);
//       localStorage.setItem("access_token", response.accessToken);

//       toast.success("bshjfjwe");

//       console.log(decoded);
//     } else {
//       toast.error(response.message);
//     }
//   };

//   return (
//     <Stack
//       justifyContent="center"
//       alignItems="center"
//       minHeight="100vh"
//       bgcolor="#f5f5f5"
//     >
//       <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           Login
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2}>
//             <TextField
//               label="Email"
//               type="email"
//               fullWidth
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <TextField
//               label="Password"
//               type="password"
//               fullWidth
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                 />
//               }
//               label="Remember Me"
//             />

//             <Button type="submit" variant="contained" fullWidth>
//               Log In
//             </Button>
//           </Stack>
//         </form>
//       </Paper>
//     </Stack>
//   );
// }

// export default LoginPage;



import React, { useState, type FormEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import logo from "../../../assets/logo.png";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import styles from './LoginPage.module.scss'
import { RoutePaths, UserRoles } from "../../../Constants";
import currentUserService from "../../../Services/Authentication/CurrentUserService";
import { SET_CURRENT_USER } from "../../../Redux/Auth/AuthActionTypes";
import { useDispatch } from "react-redux";

interface DecodedToken {
  Role: "Admin" | "Manager" | "User";
  [key: string]: any;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

   const handleLogin = async (e : FormEvent) => {
    e.preventDefault();

    const request: LoginRequestModel = { email, password, rememberMe };

    const response = await loginService.Login(request);

    console.log(response);

    if (response.isSuccess) {
      const decoded: any = jwtDecode(response.accessToken);
      localStorage.setItem("access_token", response.accessToken);

      const res = await currentUserService.GetCurrentUser();

      dispatch({ type: SET_CURRENT_USER, payload: res });


      console.log(decoded);

      if(decoded.Role == UserRoles.Admin)
      {
        navigate(RoutePaths.AdminDashboard)
      }
      else if(decoded.Role == UserRoles.Manager)
      {
        navigate(RoutePaths.UserHomeFull)
      }
      else if(decoded.Role == UserRoles.User)
      {
        navigate(RoutePaths.UserHomeFull)
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Box className={styles.RegistrationContainer}>
      <Paper elevation={3} sx={{ minWidth: 500, mx: "auto", p: 5, py: 8 }}>
        <Box display="flex" justifyContent="center" mb={3}>
          <img src={logo} alt="Logo" className={styles.main_color_filter} />
        </Box>

        <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" width="100%">
          <Typography variant="h6" align="center" mb={4} color="textPrimary">
            Login To Your Account!
          </Typography>

          <TextField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
            label="Email"
            fullWidth
            sx={{ mb: 3 }}
          />

          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
            label="Password"
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center">
              <Checkbox
                onChange={() => setRememberMe(!rememberMe)}
                checked={rememberMe}
              />
              <Typography variant="body2">Remember Me</Typography>
            </Box>
            <Link component={RouterLink} to="/forgotPassword" variant="body2">
              Forgot Password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
            Log in
          </Button>

          <Box display="flex" justifyContent="flex-end">
            <Typography variant="body2">
              <Link component={RouterLink} to="/Register">Don't Have Account?</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
