import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
  styled,
  Divider,
  IconButton,
  TextField,
  Input,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Directions } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import ButtonLoading from "./ButtonLoading";
import { createCard } from "../services/cardService";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { editBoardList } from "../services/boardService";

const BoardListPaper = (props) => (
  <Paper
    sx={{
      background: "rgba(255, 255, 255, 0.12)",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      // backdropFilter: "blur(2px)",
      borderRadius: 1.5,
      width: 280,
      padding: 0.7,
    }}
  >
    {props.children}
  </Paper>
);

const CardBox = (props) => (
  <Box
    sx={{
      px: 1,
      py: 0.5,
      borderRadius: 0.5,
      maxHeight: "60vh",
      overflowY: "auto",
      overflowX: "hidden",
      "&::-webkit-scrollbar": {
        width: 2,
      },
      "&::-webkit-scrollbar-track": {
        bgcolor: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        bgcolor: "gold.main",
        borderRadius: 2,
      },
    }}
  >
    {props.children}
  </Box>
);

export default function BoardList({
  list,
  provided,
  children,
  isFirst,
  isLast,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInEditMode, setIsTitleInEditMode] = useState(false);
  const [title, setTitle] = useState(list.title);

  async function handleOnClick(e) {
    setIsLoading(true);
    await createCard(list.id);
    setIsLoading(false);
  }

  async function handleOnKeyDownTitle(e) {
    if (e.key === "Enter") {
      await editBoardList({ order: list.order, title: title, listId: list.id, isLeft: null });
      setIsTitleInEditMode(false);
    } else if (e.key === "Escape") {
      setIsTitleInEditMode(false);
    }
  }

  async function handleListOrderChange(isLeft) {
    await editBoardList({ order: list.order, title: title, listId: list.id, isLeft });
  }

  return (
    <div ref={provided.innerRef} {...provided.droppableProps}>
      <BoardListPaper elevation={10} sx={{ padding: 0.3, width: 250 }}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row-reverse"
        >
          <Box>
            {isTitleInEditMode ? (
              <Input
                id={`input-title-${list.id}`}
                onBlur={(e) => setIsTitleInEditMode(false)}
                autoFocus
                color="gold"
                variant="filled"
                placeholder="Liste adını giriniz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleOnKeyDownTitle}
              />
            ) : (
              <Typography
                fontWeight={500}
                textAlign="right"
                color="gold.main"
                sx={{ px: 1, py: 0.5, cursor: "pointer" }}
                onClick={(e) => setIsTitleInEditMode(true)}
              >
                {list.title}
              </Typography>
            )}
          </Box>
          <Box>
            {!isFirst && (
              <IconButton
                color="turqoise"
                variant="outlined"
                onClick={e => handleListOrderChange(true)}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}
            {!isLast && (
              <IconButton
                color="turqoise"
                variant="outlined"
                onClick={e => handleListOrderChange(false)}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
          </Box>
        </Stack>
        <CardBox>{children}</CardBox>
        <Box sx={{ px: 1, pt: 0.5 }}>
          <ButtonLoading
            containerSx={{ width: "fit-content" }}
            buttonSx={{ py: 0.2 }}
            color="turqoise"
            variant="text"
            size="small"
            startIcon={<AddIcon />}
            content="Kart Oluştur"
            loading={isLoading}
            onClick={handleOnClick}
          />
        </Box>
      </BoardListPaper>
    </div>
  );
}
