import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import billReducer from "./slice/billSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bill: billReducer,
  },
});

export default store;
