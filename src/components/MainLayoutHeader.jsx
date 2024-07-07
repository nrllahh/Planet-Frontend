import React from "react";
import Navbar from "./Navbar";
import { Box } from "@mui/material";

const headerStyling = {
  height: "15vh",
  bgcolor: "transparent"
}

export default function MainLayoutHeader() {
  return (
    <Box sx={headerStyling}>
      <Navbar />
    </Box>
  );
}
