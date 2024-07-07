import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Link,
  FormGroup,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { signIn } from "../services/userService";
import ButtonLoading from "../components/ButtonLoading";
import Logo from "../components/Logo";
import background from "../assets/bg_signin_signup.jpg";
import { useAuth } from "../contexts/AuthContext";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessages, setValidationMessages] = useState([]);
  const { isAuthenticated, authenticate } = useAuth();

  async function handleSignIn(event) {
    if (isLoading) return;
    event.preventDefault();
    setIsLoading(true);
    const response = await signIn(email, password);
    setValidationMessages(response.validationMessages);
    setIsLoading(false);

    if (response.isSuccess) {
      authenticate();
    }
  }

  return (
    <form onSubmit={handleSignIn}>
      <Grid container sx={containerStyle}>
        <Grid item xs={12} sm={8} md={4} lg={3}>
          <Paper elevation={1} sx={{p: 6, borderRadius: 3}}>
            <Logo color="gold.main" />
            <FormGroup>
              <TextField
                fullWidth
                variant="filled"
                label="E-Posta adresi"
                type="email"
                margin="dense"
                color="gold"
                onChange={(e) => setEmail(e.target.value)}
                error={validationMessages.some((m) =>
                  m.code.startsWith("Email")
                )}
                helperText={
                  validationMessages.find((m) => m.code.startsWith("Email"))
                    ?.message
                }
              />
            </FormGroup>
            <FormGroup sx={{ marginBottom: 1 }}>
              <TextField
                fullWidth
                variant="filled"
                label="Şifre"
                type="password"
                margin="dense"
                color="gold"
                onChange={(e) => setPassword(e.target.value)}
                error={validationMessages.some((m) =>
                  m.code.startsWith("Password")
                )}
                helperText={
                  validationMessages.find((m) => m.code.startsWith("Password"))
                    ?.message
                }
              />
            </FormGroup>
            <Link component={RouterLink} to="/SignUp" sx={linkStyle}>
              Üye değil misin? Kayıt ol
            </Link>
            <ButtonLoading
              containerSx={{ marginLeft: "auto", width: "fit-content" }}
              type="submit"
              content="GİRİŞ YAP"
              variant="outlined"
              color="gold"
              loading={isLoading}
            />
          </Paper>
        </Grid>
      </Grid>
      {isAuthenticated && <Navigate to="/" />}
    </form>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  padding: "1rem",
  background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center bottom",
};

const boxStyle = {
  backgroundColor: "rgba(255, 255, 255, 1)",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const titleStyle = {
  color: "#333",
  marginBottom: "1rem",
};

const linkStyle = {
  display: "block",
  textAlign: "left",
  marginTop: "1rem",
  fontWeight: 500,
  color: "gold.main",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
};
