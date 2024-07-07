import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: []
}

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        pushNotification(state, action) {
            state.notifications.push(action.payload);
        },
        popNotification(state, action) {
            state.notifications.shift();
        }
    }
});

export const {pushNotification, popNotification} = notificationSlice.actions;
export default notificationSlice.reducer;