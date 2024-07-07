import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import {grey} from "@mui/material/colors";

const userBoardStyle = {
  bgcolor: "rgb(131,58,180)",
  display: "flex",
  border: "#BFA181 solid 1px",
  justifyContent: "start",
  alignItems: "end",
  padding: "1rem",
  cursor: "pointer",
  fontSize: "0.8rem",
  borderRadius: "0.4rem",
  height: "75px",
  fontWeight: 700,
  transition: "background 0.3s ease-in-out",
  "&:hover" : {
    background: "linear-gradient(90deg, rgba(0,0,51,0.5) 0%, rgba(19,24,98,0.5) 25%, rgba(43,88,118,0.5) 50%, rgba(67,0,133,0.5) 75%, rgba(204,204,255,0.5) 100%)"
  }
};

function getBackgroundGradient(current, total) {
  return {
    background: "linear-gradient(90deg, rgba(0,0,51,0.2) 0%, rgba(19,24,98,0.2) 25%, rgba(43,88,118,0.2) 50%, rgba(67,0,133,0.2) 75%, rgba(204,204,255,0.2) 100%)"
  };
}

export default function UserBoard({ boardId, title, current, total }) {
  return (
    <Link style={{color: grey[300]}} to={`/Boards/${boardId}`}>
      <Box sx={{...userBoardStyle, ...getBackgroundGradient(current, total)}}>{title}</Box>
    </Link>
  );
}
