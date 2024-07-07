import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentCard: null,
  listCards: [],
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setCurrentCard(state, action) {
      state.currentCard = action.payload;
    },
    setListCards(state, action) {
      state.listCards = action.payload;
    },
    moveCardForward(state, action) {
      const effectedCard = state.listCards.find(
        (c) => c.id === action.payload.cardId
      );
      effectedCard.listId = action.payload.newListId;
      effectedCard.order = action.payload.newOrder;
      state.listCards.sort((a, b) => a.order - b.order);
    },
    moveCardBackward(state, action) {
      const effectedCard = state.listCards.find(
        (c) => c.id === action.payload.cardId
      );
      effectedCard.listId = action.payload.oldListId;
      effectedCard.order = action.payload.oldOrder;
      state.listCards.sort((a, b) => a.order - b.order);
    },
    changeLabel(state, action) {
      const effectedCard = state.listCards.find(
        (c) => c.id === action.payload.cardId
      );
      if (action.payload.isAdded) {
        effectedCard.labels.push({
          boardLabelId: action.payload.boardLabel.id,
          colorCode: action.payload.boardLabel.colorCode,
          title: action.payload.boardLabel.title,
          cardId: action.payload.cardId,
        });
      } else {
        effectedCard.labels = effectedCard.labels.filter(
          (l) => l.boardLabelId !== action.payload.boardLabel.id
        );
      }
    },
    createListCard(state, action) {
      state.listCards.push(action.payload);
      state.listCards.sort((a, b) => a.order - b.order);
    },
    changeCardTitle(state, action) {
      state.listCards.find(c => c.id === action.payload.id).title = action.payload.title;
    }
  },
});

export const {
  setCurrentCard,
  setListCards,
  clearListCards,
  moveCardForward,
  moveCardBackward,
  changeLabel,
  createListCard,
  changeCardTitle
} = cardSlice.actions;
export default cardSlice.reducer;
