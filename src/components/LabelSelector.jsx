import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  Modal,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { addLabelToCard, removeLabelFromCard } from "../services/cardService";
import { changeCardLabel } from "../data/boardSlice";
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

const LabelSelector = ({ cardId, open, onClose }) => {
  const labels = useSelector((state) => state.board.currentBoard.labels);
  const cardLabels = useSelector((state) => state.card.currentCard.labels);
  const dispatch = useDispatch();
  const [selectedLabels, setSelectedLabels] = useState(
    cardLabels.map((label) => label.boardLabelId)
  );

  const handleLabelChange = async (labelId) => {
    const isSelected = selectedLabels.includes(labelId);
    setSelectedLabels((prevSelected) =>
      isSelected
        ? prevSelected.filter((id) => id !== labelId)
        : [...prevSelected, labelId]
    );

    const response = await (!isSelected ? addLabelToCard(cardId, labelId) : removeLabelFromCard(cardId, labelId));

    if(!response.isSuccess) {
      if(isSelected) {
        setSelectedLabels((prevSelected) => [...prevSelected, labelId]);
      }
      else {
        setSelectedLabels((prevSelected) => prevSelected.filter(id => id !== labelId));
      }
    }
  };

  const styleOfBox = {
    position: "absolute",
    top: "50%",
    left: "75%",
    transform: "translate(-50%, -50%)",
    width: "20%",
    bgcolor: "	#a9a9a9",
    border: "2px solid #000",
    boxShadow: 24,
    p: 3,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styleOfBox}>
        <Typography variant="h6" component="h2">
          Selected Labels
        </Typography>
        <Stack
          direction="column"
          spacing={1}
          sx={{ mt: 2, alignItems: "flex-start" }}
        >
          {labels.map((label) => (
            <FormControlLabel
              key={label.id}
              control={
                <Checkbox
                  checked={selectedLabels.includes(label.id)}
                  onChange={() => handleLabelChange(label.id)}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      backgroundColor: label.colorCode,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      marginRight: 1,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography color={getContrastTextColor(label.colorCode)}>
                      {label.title}
                    </Typography>
                  </Box>
                </Box>
              }
            />
          ))}
        </Stack>
      </Box>
    </Modal>
  );
};

export default LabelSelector;
