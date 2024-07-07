import { Box } from "@mui/material";
import React from "react";

const contentStyling = {
  height: "80vh"
};

export default function MainLayoutContent(props) {
  return <Box sx={contentStyling}>
    {props.children}
  </Box>;
}
