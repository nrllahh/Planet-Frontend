import React, { Children } from "react";
import { Paper, Box, Divider, Typography, Stack } from "@mui/material";

const paperStyling = {
  p: 2,
  background: "rgba(255, 255, 255, 0.12)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
};

export default function MainPaper(props) {
  return (
    <Paper elevation={1} sx={paperStyling}>
      <Stack color="turqoise.main" spacing={1} direction="row" alignItems="center">
        {props.icon}
        <Typography
          variant="h6"
          fontSize={20}
          display="flex"
          alignItems="center"
        >
          <Box ml="10">{props.title}</Box>
        </Typography>
      </Stack>
      <Divider />
      <Box mt={2}>{props.children}</Box>
    </Paper>
  );
}
