import {
  Modal,
  Paper,
  Box,
  FormGroup,
  TextField,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ButtonLoading from "./ButtonLoading";
import { grey } from "@mui/material/colors";
import { BorderStyle } from "@mui/icons-material";
import { createBoard, getUserBoards } from "../services/boardService";

const modalStyling = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "paper.main",
  border: 1,
  borderRadius: 5,
  borderColor: "gold.main",
  p: 5,
  minWidth: 300,
  width: "25%",
};

export default function CreateBoardModal({ open, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function onCreateBoardSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const response = await createBoard(title, description);
    if (response.isSuccess) {
      await getUserBoards();
      setIsLoading(false);
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyling}>
        <Typography variant="h5" mb={2} color="gold.main">
          Pano Bilgileri
        </Typography>
        <form onSubmit={onCreateBoardSubmit}>
          <FormGroup>
            <TextField
              fullWidth
              color="gold"
              variant="filled"
              margin="dense"
              label="Başlık"
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <TextField
              fullWidth
              color="gold"
              variant="filled"
              margin="dense"
              label="Açıklama"
              multiline
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
          <ButtonLoading
            containerSx={{ marginLeft: "auto", width: "fit-content", mt: 3 }}
            type="submit"
            content="PANO OLUŞTUR"
            variant="outlined"
            color="gold"
            loading={isLoading}
          />
        </form>
      </Box>
    </Modal>
  );
}
