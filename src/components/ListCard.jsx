import { Typography, Box, Paper, Stack } from "@mui/material";
import React from "react";

function getContrastTextColor(hexcolor) {
  if (hexcolor.indexOf("#") !== -1) {
    hexcolor = hexcolor.replace("#", "");
  }

  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

export default function ListCard({ provided, card, onClick }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={(e) => onClick(e)}
    >
      <Box sx={{ marginBottom: 0.8 }}>
        <Box
          elevation={0}
          sx={{ padding: 1, bgcolor: "paper.main", borderRadius: 2 }}
        >
          <Stack
            direction="row"
            spacing={1}
            mb={1}
            flexWrap="wrap"
            useFlexGap
            padding={"3px"}
          >
            {card.labels.map((label, index) => (
              <Box
                p={0.4}
                style={{ borderRadius: "5px" }}
                key={index}
                sx={{ bgcolor: `${label.colorCode}` }}
              >
                <Typography
                  fontSize={12}
                  fontWeight={500}
                  color={getContrastTextColor(label.colorCode)}
                >
                  {label.title}
                </Typography>
              </Box>
            ))}
          </Stack>
          <Box>
            <Typography color="accent.main">{card.title}</Typography>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
