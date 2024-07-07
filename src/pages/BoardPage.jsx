import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getCurrentBoard, addList, inviteMember } from "../services/boardService";
import { Box, CircularProgress, Stack, Button, Container } from "@mui/material";
import ButtonLoading from "../components/ButtonLoading";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import BoardList from "../components/BoardList";
import ListCard from "../components/ListCard";
import {
  getCardInfo,
  getListCards,
  handleCardMovedEvent,
  moveCard,
} from "../services/cardService";
import MemberList from "../components/MemberList";
import CardModal from "../components/CardModal";
import MainLayout from "../layout/MainLayout";
import "../styles/BoardPage.css";
import { useSignalR } from "../contexts/SignalRContext";
import PersonIcon from '@mui/icons-material/Person';

export default function BoardPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const currentBoard = useSelector((state) => state.board.currentBoard);
  const listCards = useSelector((state) => state.card.listCards);
  const [members, setMembers] = useState([]);
  const [stateOfCard, setStateOfCard] = useState(false);
  const [cardId, setCardId] = useState("");
  const [responseCard, setResponseCard] = useState({});
  const [listName, setListName] = useState("");
  const [cardStartDate, setCardStartDate] = useState("");
  const [cardEndDate, setCardEndDate] = useState("");
  const signalR = useSignalR();
  async function fetchData() {
    const response = await getCurrentBoard(id);
    await getListCards(response.body.lists.map((l) => l.id));
    setIsLoading(false);
    signalR.invoke("JoinBoardGroup", id);
  }

  async function handleOnDragEnd(result) {
    if (!result.destination) return;

    const cardId = result.draggableId;
    const destinationId = result.destination.droppableId;
    const destinationIndex = result.destination.index;
    const sourceId = result.source.droppableId;
    const sourceIndex = result.source.index;

    if (destinationId === sourceId && destinationIndex === sourceIndex) return;

    const destinationListCards = listCards.filter(
      (c) => c.listId === destinationId
    );

    const oldOrder = listCards.find((c) => c.id === cardId).order;
    let newOrder = 0;

    if (destinationId === sourceId) {
      if (destinationIndex === 0) {
        newOrder =
          destinationListCards.length > 0
            ? destinationListCards[0].order / 2
            : 1024;
      } else if (destinationIndex === destinationListCards.length - 1) {
        newOrder = destinationListCards[destinationIndex].order + 1024;
      } else {
        newOrder =
          (destinationListCards[
            destinationIndex > sourceIndex
              ? destinationIndex + 1
              : destinationIndex - 1
          ].order +
            destinationListCards[destinationIndex].order) /
          2;
      }
    } else {
      if (destinationIndex === 0) {
        newOrder =
          destinationListCards.length > 0
            ? destinationListCards[0].order / 2
            : 1024;
      } else if (destinationIndex === destinationListCards.length) {
        newOrder = destinationListCards[destinationIndex - 1].order + 1024;
      } else {
        newOrder =
          (destinationListCards[destinationIndex - 1].order +
            destinationListCards[destinationIndex].order) /
          2;
      }
    }

    const moveArgs = {
      newListId: destinationId,
      oldListId: sourceId,
      newOrder,
      oldOrder,
      cardId,
      sourceIndex,
      destinationIndex,
    };

    await moveCard(moveArgs);
  }

  useEffect(() => {
    fetchData();

    return () => {
      signalR.invoke("LeaveBoardGroup", id);
    };
  }, []);

  const handleCardClose = () => {
    setStateOfCard(false);
  };

  const handleAddList = async () => {
    await addList(currentBoard.id);
  };

  async function fetchDataForCard(cardId) {
    const response = await getCardInfo(cardId);
    setCardStartDate(response.body.startDate?.split("T")[0]);
    setCardEndDate(response.body.endDate?.split("T")[0]);
    setStateOfCard(true);
  }

  async function handleInvitation() {
    await inviteMember(id);
  }

  return (
    <MainLayout>
      {isLoading ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress color="gold" />
        </Box>
      ) : (
        <Container maxWidth="xl">
          <Box sx={{px:5, py:1}}>
            <Button onClick={handleInvitation} startIcon={<PersonIcon />} variant="outlined" color="turqoise">DAVET BAĞLANTISI OLUŞTUR</Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              overflowY: "hidden",
              p: 5,
              "&::-webkit-scrollbar": {
                height: 5,
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "gold.main",
                borderRadius: 2,
              },
            }}
          >
            <CardModal
              cardId={cardId}
              listName={listName}
              state={stateOfCard}
              handleClose={handleCardClose}
              cardResponse={responseCard}
            />
            <Box sx={{ flexGrow: 1 }}>
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Stack
                  direction="row"
                  spacing={3}
                  justifyContent="center"
                  style={{ margin: "0 auto" }}
                >
                  {currentBoard?.lists?.map((list, index) => (
                    <Droppable
                      key={list.id.toString()}
                      droppableId={list.id.toString()}
                    >
                      {(provided) => (
                        <BoardList list={list} provided={provided} isFirst={index === 0} isLast={index === currentBoard.lists.length - 1}>
                          {listCards
                            ?.filter((c) => c.listId === list.id)
                            .map((card, index) => (
                              <Draggable
                                key={card.id.toString()}
                                draggableId={card.id.toString()}
                                index={index}
                              >
                                {(provided) => (
                                  <ListCard
                                    card={card}
                                    provided={provided}
                                    onClick={(e) => {
                                      setListName(list.title);
                                      setCardId(card.id);
                                      fetchDataForCard(card.id);
                                    }}
                                  />
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </BoardList>
                      )}
                    </Droppable>
                  ))}
                  <Box>
                    <ButtonLoading
                      containerSx={{ width: "fit-content" }}
                      buttonSx={{ minWidth: 170 }}
                      onClick={handleAddList}
                      color="turqoise"
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      content="LİSTE OLUŞTUR"
                    />
                  </Box>
                </Stack>
              </DragDropContext>
            </Box>
          </Box>
        </Container>
      )}
    </MainLayout>
  );
}
