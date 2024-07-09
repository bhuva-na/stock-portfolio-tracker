import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    clientLogin: {
      user: null,
      userId: null,
    },
    stockData: {
      metaData: {},
      timeSeries: {}
    },
  },
  reducers: {
    setClientLogin: (state, action) => {
      state.clientLogin.user = action.payload.user; 
      state.clientLogin.userId = action.payload.id; 
    },
    setStockData: (state, action) => {
      state.stockData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setClientLogin,setStockData } = userSlice.actions;

export default userSlice.reducer;
