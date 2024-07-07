import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import Notification from "./components/Notification";
import BoardPage from "./pages/BoardPage";
import AuthProvider from "./contexts/AuthContext";
import SignalRProvider from "./contexts/SignalRContext";
import { grey } from "@mui/material/colors";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import InvitationPage from "./pages/InvitationPage";

const theme = createTheme({
  palette: {
    mode: "dark",
    turqoise: {
      main: "#30d5c8",
    },
    gold: {
      main: "#BFA181",
    },
    paper: {
      main: grey[900]
    },
    accent: {
      main: grey[500]
    },
    header: {
      main: grey[900],
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <SignalRProvider>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/SignIn" element={<SignInPage />} />
            <Route path="/SignUp" element={<SignUpPage />} />
            <Route path="/Boards/:id" element={<BoardPage />} />
            <Route path="/Invitation/:key" element={<InvitationPage />} />
          </Routes>
          {<Notification />}
        </ThemeProvider>
      </SignalRProvider>
    </AuthProvider>
  );
}

export default App;
