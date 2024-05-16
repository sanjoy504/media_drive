import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./User/userSlice";
import webStateReducer from "./web_state/webStateSlice";

export const reduxStore = configureStore({
    reducer: {
        user: userReducer,
        webState: webStateReducer,
    },
});
