import React, { useContext } from "react";
import MainLayoutHeader from "../components/MainLayoutHeader";
import MainLayoutContent from "../components/MainLayoutContent";
import MainLayoutFooter from "../components/MainLayoutFooter";
import { AuthContext, useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import background from "../assets/bg_mainlayout.jpg";
import { Box } from "@mui/material";

const backgroundStyling = {
  backgroundColor: "black",
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${background})`,
  backgroundSize: "cover",
  backgrondPosition: "center center",
  opacity: 1,
  width: "100%",
  height: "100vh",
  position: "absolute",
  zIndex: -10,
};

export default function MainLayout(props) {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ position: "relative" }}>
      {!isAuthenticated && <Navigate to="/SignIn" />}
      <Box sx={backgroundStyling}></Box>
      <MainLayoutHeader />
      <MainLayoutContent>{props.children}</MainLayoutContent>
      <MainLayoutFooter />
    </Box>
  );
}
