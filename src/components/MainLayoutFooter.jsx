import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Height } from "@mui/icons-material";

const footerStyling = {
  height: "5vh",
};

export default function MainLayoutFooter() {
  return (
    <Box sx={footerStyling}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        <Typography fontSize={15} color="accent.main">
          Developed with{" "}
        </Typography>
        <FavoriteBorderIcon color="turqoise" />
        <Typography color="accent.main">by</Typography>
        <Typography fontWeight="bold" color="gold.main">Team Planet</Typography>
      </Stack>
    </Box>
  );
}
