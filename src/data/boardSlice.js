import { createSlice, current } from "@reduxjs/toolkit";
import { moveCard } from "../services/cardService";
import BoardList from "../components/BoardList";

const initialState = {
  userBoards: [],
  currentBoard: null,
  boardLists: [],
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setUserBoards(state, action) {
      state.userBoards = action.payload;
    },
    setCurrentBoard(state, action) {
      state.currentBoard = action.payload;
    },
    createBoardList(state, action) {
      state.currentBoard.lists.push(action.payload);
    },
    editList(state, action) {
      const editedList = state.currentBoard?.lists.find(l => l.id === action.payload.listId);
      editedList.title = action.payload.title;
      editedList.order = action.payload.order;

      state.currentBoard?.lists.sort((a,b) => a.order - b.order);
    },
    changeListTitle(state,action) {
      state.currentBoard.lists.find(l => l.id === action.payload.id).title = action.payload.title;
    },
    changeListOrder(state, action) {
      state.currentBoard.lists.find(l => l.id === action.payload.id).order = action.payload.order;
      state.currentBoard.lists.sort((a, b) => a.order - b.order);
    }
  },
});

export const {
  setUserBoards,
  setCurrentBoard,
  changeCardLabel,
  createBoardList,
  editList,
  changeListOrder,
  changeListTitle
} = boardSlice.actions;
export default boardSlice.reducer;
