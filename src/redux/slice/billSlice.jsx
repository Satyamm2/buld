import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    billBalance: null,
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    refreshBill: (state) => {
      state.fetchBillRefresh = !state.fetchBillRefresh;
    },
  },
});

export const { refreshBill } = billSlice.actions;

export default billSlice.reducer;
