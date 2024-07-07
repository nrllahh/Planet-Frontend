import {
  AppBar,
  Typography,
  Container,
  Box,
  Button,
  Stack,
  Tooltip,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from "../services/userService";
import { useAuth } from "../contexts/AuthContext";
import { redirect } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const {revoke, user} = useAuth();
  const [anchorElUser, setAnchorElUser] = useState(null);
  function handleOpenUserMenu(event) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

  function handleSignOut() {
    revoke();
    signOut();
    redirect("/SignIn");
  }

  const navbarSx = {
    height: "100%",
    display: "flex",
    alignItems: "center"
  }


  return (
    <Box sx={navbarSx}>
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center">
          <Box marginRight={10}>
            <Logo size={35} color="gold.main" />
          </Box>
          <Stack ml="auto" direction="row" alignItems="center" spacing={2}>
            <Box>
              <Tooltip title={user.name}>
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key="test" onClick={handleSignOut}>
                  <Stack alignItems="center" direction="row" gap={1}>
                    <LogoutIcon />
                    <Typography>Çıkış Yap</Typography>
                  </Stack>
                </MenuItem>
              </Menu>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
