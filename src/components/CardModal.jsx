import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Button,
  Stack,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Menu,
  MenuItem,
  InputAdornment,
  Grid,
  ListItemButton,
  Divider,
  ListItemAvatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import ListItemIcon from "@mui/material/ListItemIcon";
import LabelSelector from "./LabelSelector";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CommentIcon from "@mui/icons-material/Comment";
import AddCommentIcon from "@mui/icons-material/AddComment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {
  getCardInfo,
  editCardTitle,
  editCardDesc,
  editCheckListItem,
  addCheckListItem,
  addCheckList,
  editCheckListTitle,
  removeCheckList,
  removeCheckListItem,
  addComment,
  editCardDate,
} from "../services/cardService";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import "../styles/CardModal.css";
import { Label } from "@mui/icons-material";
import ContextMenu from "./ContextMenu";
import { isFulfilled } from "@reduxjs/toolkit";
import { useTheme } from "@mui/material/styles";
export default function CardModal({
  cardId,
  listName,
  handleClose,
  state,
  startDate,
  endDate,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const currentCard = useSelector((state) => state.card.currentCard);
  const [isEditForTitle, setIsEditForTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isEditForDesc, setIsEditForDesc] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [initials, setInitials] = useState([]);
  const [checkLists, setCheckLists] = useState([]);
  const [comments, setComments] = useState([]);
  const [nameOfList, setNameOfList] = useState("");
  const [cardOwnerName, setCardOwnerName] = useState("");
  const [openLabelModal, setOpenLabelModal] = useState(false);
  const [isAddItem, setIsAddItem] = useState(false);
  const [idForCheckList, setIdForCheckList] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [addCheckListState, setAddCheckListState] = useState(false);
  const [newCheckListTitle, setNewCheckListTitle] = useState("");
  const [menuPosition, setMenuPosition] = useState(null);
  const [copyText, setCopyText] = useState("");
  const [isEditCheckListTitle, setIsEditCheckListTitle] = useState(false);
  const [editType, setEditType] = useState("");
  const [isEditItemContent, setIsEditItemContent] = useState(false);
  const [idForItem, setIdForItem] = useState("");
  const [newComment, setNewComment] = useState("");
  const [changedStartDate, setChangedStartDate] = useState("");
  const [changedEndDate, setChangedEndDate] = useState("");
  async function fetchData() {
    const cardResponse = await getCardInfo(cardId);
    if (cardResponse.isSuccess) {
      setChangedStartDate(startDate);
      setChangedEndDate(endDate);
      const initialArray = cardResponse.body.users.map((user) => {
        const names = user.fullName ? user.fullName.split(" ") : [];
        const firstNameInitial = names[0] ? names[0][0].toUpperCase() : "";
        const lastNameInitial =
          names.length > 1 ? names[names.length - 1][0].toUpperCase() : "";
        return `${firstNameInitial}${lastNameInitial}`;
      });
      setInitials(initialArray);
      const checkListsArray = cardResponse.body.checkLists.map((checkList) => ({
        title: checkList.title,
        id: checkList.id,
        items: checkList.items.map((item) => item),
      }));
      setCheckLists(checkListsArray);
      const commentsArray = cardResponse.body.comments.map((comment) => {
        return comment;
      });
      setComments(commentsArray);
      setCardOwnerName(
        cardResponse.body.users.find((user) => user.type === 1).fullName
      );
      setNewTitle(cardResponse.body.title);
      setNameOfList(listName);
      setIsLoading(!cardResponse.isSuccess);
    }
  }

  const handleMenuClose = () => {
    setMenuPosition(null);
  };

  const clickedMenuOption = (option) => {
    setMenuPosition(null);
    if (editType === "checklist" && option === 1) {
      setIsEditCheckListTitle(true);
    }

    if (editType === "checkListItem" && option === 1) {
      setIsEditItemContent(true);
    }

    if (editType === "checklist" && option === 2) {
      deleteCheckList();
    }
    if (editType === "checkListItem" && option === 2) {
      deleteCheckListItem();
    }
  };

  const deleteCheckList = async () => {
    const response = await removeCheckList({
      cardId: cardId,
      checkListId: idForCheckList,
    });
    if (response.isSuccess) {
      setIdForCheckList("");
      fetchData();
    }
  };

  const deleteCheckListItem = async () => {
    const response = await removeCheckListItem({
      cardId: cardId,
      checkListId: idForCheckList,
      checkListItemId: idForItem,
    });
    if (response.isSuccess) {
      setIdForItem("");
      fetchData();
    }
  };

  const addUserComment = async (e) => {
    if (e.keyCode === 13) {
      const response = await addComment({
        cardId: cardId,
        comment: newComment,
      });
      if (response.isSuccess) {
        setNewComment("");
        await fetchData();
      }
    }
  };

  const editDate = async (datetype, day, month, year) => {
    const newMonth = month.toString().length === 2 ? month : "0".concat(month.toString());
    const newDay = day.toString().length === 2 ? day : "0".concat(day.toString());
    const newDate = `${year}-${newMonth}-${newDay}`;
    if (datetype === "start") {
      const response = await editCardDate({
        cardId: cardId,
        startDate: newDate,
        endDate: changedEndDate,
      });
      if (response.isSuccess) {
        setChangedStartDate(newDate);
      }
    }
    if (datetype === "end") {
      const response = await editCardDate({
        cardId: cardId,
        startDate: changedStartDate,
        endDate: newDate,
      });
      if (response.isSuccess) {
        setChangedEndDate(newDate);
      }
    }
  };

  const handleRightClick = (event, value, type, id, listId) => {
    setCopyText(value);
    setEditType(type);
    setIsEditCheckListTitle(false);
    setIsEditItemContent(false);
    if (type === "checklist") {
      setIdForCheckList(id);
    }
    if (type === "checkListItem") {
      setIdForItem(id);
      setIdForCheckList(listId);
    }

    event.preventDefault();

    setMenuPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  function getRandomColor(initial) {
    const charCode1 = initial.charCodeAt(0);
    const charCode2 = initial.charCodeAt(1);

    const hex1 = (charCode1 % 256).toString(16).padStart(2, "0");
    const hex2 = (charCode2 % 256).toString(16).padStart(2, "0");

    const color = `#${hex1}${hex2}${(charCode1 + charCode2) % 256}`;

    return color;
  }
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
  useEffect(() => {
    if (state) {
      setIsEditForTitle(false);
      setIsEditForDesc(false);
      fetchData();
    }
  }, [state]);

  const checkListItemCheckEdit = async (item, listId) => {
    const changedCheck = !item.isChecked;
    const checkListClone = checkLists.map((checklist) => ({
      ...checklist,
      items: checklist.items.map((i) => {
        if (i.id === item.id) {
          return { ...i, isChecked: !i.isChecked };
        }
        return i;
      }),
    }));
    setCheckLists(checkListClone);
    await editCheckListItem({
      cardId: cardId,
      checkListId: listId,
      checkListItemId: item.id,
      isChecked: changedCheck,
      content: item.content,
    });
  };

  const checkListItemContentEdit = async (
    event,
    cardId,
    listId,
    itemId,
    isChecked,
    content
  ) => {
    if (event.keyCode === 13) {
      const response = await editCheckListItem({
        cardId: cardId,
        checkListId: listId,
        checkListItemId: itemId,
        isChecked: isChecked,
        content: content,
      });
      if (response.isSuccess) {
        setIsEditItemContent(false);
        setNewItemContent("");
        fetchData();
      }
    }
  };

  const checkListTitleEdit = async (event, cardId, listId, title) => {
    if (event.keyCode === 13) {
      const response = await editCheckListTitle({
        cardId: cardId,
        checkListId: listId,
        newTitle: title,
      });
      if (response.isSuccess) {
        setIsEditCheckListTitle(false);
        setNewCheckListTitle("");
        fetchData();
      }
    }
  };

  const addListItem = async (event, cardId, listId, content) => {
    if (event.keyCode === 13) {
      const response = await addCheckListItem({
        cardId: cardId,
        checkListId: listId,
        content: content,
      });
      if (response.isSuccess) {
        setIsAddItem(false);
        setNewItemContent("");
        fetchData();
      }
    }
  };

  const addCheckListToCard = async (event, cardId, title) => {
    if (event.keyCode === 13) {
      const response = await addCheckList({
        cardId: cardId,
        title: title,
      });
      if (response.isSuccess) {
        setAddCheckListState(false);
        setNewCheckListTitle("");
        fetchData();
      }
    }
  };

  const editElements = async (event, element) => {
    if (
      event.keyCode === 13 ||
      (event.relatedTarget && event.relatedTarget.nodeName !== "BODY")
    ) {
      switch (element) {
        case "title":
          setIsEditForTitle(false);
          const editTitleResponse = await editCardTitle({
            cardId: cardId,
            title: newTitle,
          });
          if (editTitleResponse.isSuccess) {
            fetchData();
          }
        case "desc":
          setIsEditForDesc(false);
          const editDescResponse = await editCardDesc({
            cardId: cardId,
            description: newDesc,
          });
          if (editDescResponse.isSuccess) {
            fetchData();
          }
      }
    }
  };
  if (isLoading && state) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (state) {
    return (
      <Modal
        open={state}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="modal"
      >
        <Box className="modal-content">
          <LabelSelector
            cardId={cardId}
            open={openLabelModal}
            onClose={() => {
              setOpenLabelModal(false);
              fetchData();
            }}
          />
          <Grid>
            <TextField
              className="custom-textfield"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubtitlesIcon />
                  </InputAdornment>
                ),
              }}
              //sx={{ input: styleOfTextField }}
              size="medium"
              onKeyDown={(e) => editElements(e, "title")}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={(e) => editElements(e, "title")}
              defaultValue={currentCard.title}
            />
          </Grid>
          <Grid>
            <Typography className="list-name">
              {listName} isimli listede
            </Typography>
          </Grid>
          <br />
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box className="avatarGroupContainer">
              <Typography className="membersLabel" sx={{ fontSize: 12 }}>
                Üyeler
              </Typography>
              <AvatarGroup max={3} sx={{ ml: 1 }}>
                {initials.map((initial, index) => (
                  <Avatar
                    key={index}
                    alt={initial}
                    sx={{ bgcolor: getRandomColor(initial), mt: 1 }}
                  >
                    {initial}
                  </Avatar>
                ))}
              </AvatarGroup>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 1,
                  color: "rgba(255, 255, 255, 0.397)",
                  ml: 1,
                }}
              >
                Kart Sahibi: {cardOwnerName}
              </Typography>
            </Box>
            {currentCard.labels.length !== 0 ? (
              <Box className="avatarGroupContainer" sx={{ ml: 5 }}>
                <Typography className="membersLabel" sx={{ fontSize: 12 }}>
                  Etiketler
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  mb={1}
                  mt={4}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {currentCard.labels.map((label, index) => (
                    <Box
                      p={0.4}
                      style={{ borderRadius: "5px" }}
                      key={index}
                      sx={{ backgroundColor: `${label.colorCode}` }}
                      className="labels"
                      onClick={() => setOpenLabelModal(true)}
                    >
                      <Typography
                        fontSize={18}
                        fontWeight={500}
                        color={getContrastTextColor(label.colorCode)}
                      >
                        {label.title}
                      </Typography>
                    </Box>
                  ))}
                  <Button
                    color="primary"
                    sx={{ pl: 2.5 }}
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setOpenLabelModal(true);
                      fetchData();
                    }}
                  ></Button>
                </Stack>
              </Box>
            ) : (
              <Box className="avatarGroupContainer" sx={{ ml: 5 }}>
                <Typography className="membersLabel" sx={{ fontSize: 12 }}>
                  Etiketler
                </Typography>
                <Button
                  color="primary"
                  sx={{ pl: 2.5, mt: 4 }}
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setOpenLabelModal(true);
                    fetchData();
                  }}
                ></Button>
              </Box>
            )}
          </Box>

          <InputAdornment position="start" className="desc-icon">
            <DescriptionIcon />
            <Typography className="desc-icon-text">Açıklama</Typography>
          </InputAdornment>
          <Grid>
            <TextField
              className="custom-richtextbox"
              variant="outlined"
              multiline
              rows={5}
              sx={{ mb: 2 }}
              onKeyDown={(e) => editElements(e, "desc")}
              onChange={(e) => setNewDesc(e.target.value)}
              onBlur={(e) => editElements(e, "desc")}
              defaultValue={currentCard.description}
              placeholder={
                currentCard.description
                  ? currentCard.description
                  : "Kart açıklaması ekleyin"
              }
            />
          </Grid>

          {checkLists.length !== 0 ? (
            <List>
              {checkLists.map((checkList) => (
                <li key={checkList.id}>
                  <ul>
                    {isEditCheckListTitle && checkList.id === idForCheckList ? (
                      <TextField
                        className="custom-textfield"
                        variant="outlined"
                        size="medium"
                        sx={{ mt: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ChecklistIcon />
                            </InputAdornment>
                          ),
                        }}
                        onKeyDown={(e) =>
                          checkListTitleEdit(
                            e,
                            cardId,
                            checkList.id,
                            newCheckListTitle
                          )
                        }
                        onChange={(e) => setNewCheckListTitle(e.target.value)}
                        onBlur={() => {
                          setIsEditCheckListTitle(false);
                        }}
                        defaultValue={checkList.title}
                      />
                    ) : (
                      <InputAdornment
                        sx={{ mb: 3 }}
                        position="start"
                        className="checklist-icon"
                      >
                        <ChecklistIcon />
                        <Typography
                          className="desc-icon-text"
                          sx={{ fontWeight: "bold" }}
                          onContextMenu={(e) => {
                            handleRightClick(
                              e,
                              checkList.title,
                              "checklist",
                              checkList.id
                            );
                          }}
                        >
                          {checkList.title}
                        </Typography>
                      </InputAdornment>
                    )}
                    {checkList.items.map((item) =>
                      // <ListItem key={itemIndex}>
                      //   <Checkbox
                      //     edge="start"
                      //     checked={item.checked}
                      //     tabIndex={-1}
                      //     disableRipple
                      //   />
                      //   <ListItemText primary={item} />
                      // </ListItem>

                      isEditItemContent && item.id === idForItem ? (
                        <TextField
                          className="custom-textfield"
                          variant="outlined"
                          size="medium"
                          sx={{ mt: 1 }}
                          onKeyDown={(e) =>
                            checkListItemContentEdit(
                              e,
                              cardId,
                              checkList.id,
                              item.id,
                              item.isChecked,
                              newItemContent
                            )
                          }
                          onChange={(e) => setNewItemContent(e.target.value)}
                          onBlur={() => {
                            setIsEditItemContent(false);
                          }}
                          defaultValue={item.content}
                        />
                      ) : (
                        <ListItemButton
                          role={undefined}
                          dense
                          onClick={() => {
                            checkListItemCheckEdit(item, checkList.id);
                          }}
                          onContextMenu={(e) => {
                            handleRightClick(
                              e,
                              item.content,
                              "checkListItem",
                              item.id,
                              checkList.id
                            );
                          }}
                          autoFocus
                        >
                          <ListItemIcon>
                            <Checkbox
                              id={item.id}
                              edge="start"
                              checked={item.isChecked}
                              tabIndex={-1}
                              disableRipple
                              onClick={() => {
                                checkListItemCheckEdit(item, checkList.id);
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText id={item.id} primary={item.content} />
                        </ListItemButton>
                      )
                    )}
                    {isAddItem && checkList.id === idForCheckList ? (
                      <TextField
                        className="custom-textfield"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AddTaskIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mt: 2.5 }}
                        size="medium"
                        onKeyDown={(e) =>
                          addListItem(e, cardId, checkList.id, newItemContent)
                        }
                        onChange={(e) => setNewItemContent(e.target.value)}
                        onBlur={() => setIsAddItem(false)}
                        defaultValue=""
                        placeholder="Görev içeriğini giriniz."
                      />
                    ) : (
                      <Button
                        onClick={() => {
                          setIsAddItem(true);
                          setIdForCheckList(checkList.id);
                        }}
                        variant="outlined"
                        startIcon={<AddTaskIcon />}
                        sx={{ ml: 1.5, mt: 2.5 }}
                      >
                        GÖREV EKLE
                      </Button>
                    )}
                  </ul>
                </li>
              ))}
              {addCheckListState ? (
                <TextField
                  className="custom-textfield"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ChecklistIcon />
                      </InputAdornment>
                    ),
                  }}
                  size="medium"
                  sx={{ mt: 4 }}
                  onKeyDown={(e) =>
                    addCheckListToCard(e, cardId, newCheckListTitle)
                  }
                  onChange={(e) => setNewCheckListTitle(e.target.value)}
                  onBlur={() => setAddCheckListState(false)}
                  defaultValue=""
                  placeholder="Görev içeriğini giriniz."
                />
              ) : (
                <InputAdornment
                  position="start"
                  className="checklist-icon"
                  sx={{ mt: 2, mb: 3 }}
                >
                  <ChecklistIcon />
                  <Typography className="desc-icon-text">
                    <Button
                      onClick={() => {
                        setAddCheckListState(true);
                      }}
                      variant="outlined"
                      sx={{ ml: 1.5 }}
                    >
                      CHECKLIST EKLE
                    </Button>
                  </Typography>
                </InputAdornment>
              )}
            </List>
          ) : addCheckListState ? (
            <TextField
              className="custom-textfield"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ChecklistIcon />
                  </InputAdornment>
                ),
              }}
              size="medium"
              sx={{ mt: 4 }}
              onKeyDown={(e) =>
                addCheckListToCard(e, cardId, newCheckListTitle)
              }
              onChange={(e) => setNewCheckListTitle(e.target.value)}
              onBlur={() => setAddCheckListState(false)}
              defaultValue=""
              placeholder="Görev içeriğini giriniz."
            />
          ) : (
            <InputAdornment
              position="start"
              className="checklist-icon"
              sx={{ mt: 2, mb: 2 }}
            >
              <ChecklistIcon />
              <Typography className="desc-icon-text">
                <Button
                  onClick={() => {
                    setAddCheckListState(true);
                  }}
                  variant="outlined"
                  sx={{ ml: 1.5 }}
                >
                  CHECKLIST EKLE
                </Button>
              </Typography>
            </InputAdornment>
          )}
          {menuPosition === null ? (
            <></>
          ) : (
            <ContextMenu
              menuPosition={menuPosition}
              handleMenuClose={handleMenuClose}
              textToCopy={copyText}
              clickedMenuOption={clickedMenuOption}
            />
          )}
          <InputAdornment
            position="start"
            className="checklist-icon"
            sx={{ mt: 2, mb: 2 }}
          >
            <CommentIcon />
            <Typography className="desc-icon-text" sx={{ fontWeight: "bold" }}>
              YORUMLAR
            </Typography>
          </InputAdornment>

          <List sx={{ width: "100%", maxWidth: 360 }}>
            {comments.map((comment, index) => (
              <>
                <ListItem alignItems="flex-start" key={index}>
                  <ListItemAvatar>
                    <Avatar
                      alt={comment.fullName}
                      src="/static/images/avatar/1.jpg"
                    />
                  </ListItemAvatar>
                  <ListItemText
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="white"
                          fontWeight="bold"
                        >
                          {comment.fullName}
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="white"
                        >
                          {` — ${comment.content}`}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            ))}
          </List>
          <br />
          <TextField
            className="custom-textfield-comment"
            variant="standard"
            sx={{ ml: 1 }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ pl: 3 }}>
                  <AddCommentIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => addUserComment(e)}
            placeholder="Yorum ekleyin"
          />
          <InputAdornment position="start" className="desc-icon" sx={{ mt: 5 }}>
            <DateRangeIcon />
            <Typography className="desc-icon-text" sx={{ fontWeight: "bold" }}>
              Tarihler
            </Typography>
          </InputAdornment>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
            <div style={{ marginTop: 30, display: "flex", gap: "16px" }}>
              <DatePicker
                label="Başlangıç Tarihi"
                defaultValue={startDate ? dayjs(startDate) : null}
                format="DD/MM/YYYY"
                onChange={(e) => editDate("start", e.$D, e.$M + 1, e.$y)}
              />
              <DatePicker
                label="Bitiş Tarihi"
                sx={{ floodColor: "white", outlineColor: "white" }}
                defaultValue={endDate ? dayjs(endDate) : null}
                format="DD/MM/YYYY"
                onChange={(e) => editDate("end", e.$D, e.$M + 1, e.$y)}
              />
            </div>
          </LocalizationProvider>
        </Box>
      </Modal>
    );
  }
}
