import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  billBalance: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    refreshBill: (state, action) => {
      state.fetchBillRefresh = action.payload.balanceLeft;
    },
  },
});

export const { refreshBill } = billSlice.actions;

export default billSlice.reducer;
