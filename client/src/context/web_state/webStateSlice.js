import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sideBarOpen: false
};

export const webStateSlice = createSlice({
  name: 'web state',
  initialState,
  reducers: {
    updateWebState: (state, action) => {

      const updatedState = { ...state, ...action.payload };
      return updatedState;
    },
  },
});

export const {
    updateWebState
} = webStateSlice.actions;

export default webStateSlice.reducer;