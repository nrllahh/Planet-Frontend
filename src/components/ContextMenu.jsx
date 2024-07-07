import {
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  ListItemText,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { useState } from "react";
function ContextMenu(props) {
  const { menuPosition, handleMenuClose, clickedMenuOption, textToCopy } =
    props;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {})
      .catch((err) => {
        console.error("Kopyalama işlemi başarısız:", err);
      });
  };

  return (
    <>
      <Menu
        open={menuPosition !== null}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition !== null
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleCopy();
            clickedMenuOption(0);
          }}
        >
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Kopyala</ListItemText>
          <Typography variant="body2" color="text.secondary"></Typography>
        </MenuItem>

        <MenuItem onClick={() => clickedMenuOption(1)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Düzenle</ListItemText>
          <Typography variant="body2" color="text.secondary"></Typography>
        </MenuItem>

        <MenuItem onClick={() => clickedMenuOption(2)}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: red[500] }} />
          </ListItemIcon>
          <ListItemText sx={{ color: red[500] }}>Sil</ListItemText>
          <Typography variant="body2" color="text.secondary"></Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ContextMenu;
