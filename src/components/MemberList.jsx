import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";

export default function MemberList() {
  const currentBoard = useSelector((state) => state.board.currentBoard);

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        boxShadow: 3,
        width: "300px",
        margin: "0 auto",
      }}
    >
      <Typography
        variant="h5"
        sx={{ marginBottom: 2, color: "#3f51b5", textAlign: "center" }}
      >
        Board Members
      </Typography>
      <List>
        {currentBoard.members.map((member) => (
          <ListItem
            key={member.id}
            sx={{
              backgroundColor: "#3EBCE5",
              borderRadius: "40px",
              marginBottom: "8px",
              boxShadow: 1,
              width: "auto",
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ backgroundColor: "#3f51b5", color: "#ffffff" }}>
                {member.firstName[0]}
                {member.lastName[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${member.firstName} ${member.lastName}`}
              primaryTypographyProps={{ color: "#333" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
