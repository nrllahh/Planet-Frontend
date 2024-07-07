import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";
import cardReducer from "./cardSlice";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    board: boardReducer,
    card: cardReducer,
    notification: notificationReducer,
    user: userReducer
  },
});
