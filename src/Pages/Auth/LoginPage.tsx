import { useState, type FormEvent } from "react";
import type { ILoginPageProps } from "./ILoginPageProps";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { LoginService } from "../../Services/Authentication/LoginService";
import type { LoginRequestModel } from "../../Models/RequestModels/LoginRequestModel";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function LoginPage(_props: ILoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    handleLogin();
  };

  const handleLogin = async () => {
    const loginService = new LoginService();

    const request: LoginRequestModel = { email, password, rememberMe };

    const response = await loginService.Login(request);

    console.log(response);

    if (response.isSuccess) {
      const decoded: any = jwtDecode(response.accessToken);
      localStorage.setItem("access_token", response.accessToken);

      toast.success("bshjfjwe");

      console.log(decoded);

      //   switch (decoded.Role) {
      //     case "Admin":
      //       navigate("/admin/dashboard");
      //       break;
      //     case "Manager":
      //       navigate("/manager/dashboard");
      //       break;
      //     default:
      //       navigate("/user/home");
      //   }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember Me"
            />

            <Button type="submit" variant="contained" fullWidth>
              Log In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}

export default LoginPage;
