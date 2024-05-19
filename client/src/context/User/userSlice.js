import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  name: null,
  email: null,
  avatar: null,
  storageDetails: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDataState: (state, action) => {

      //Update stste 
      const updatedState = { ...state, ...action.payload };
      return updatedState;
    },


    logoutUser: () => {
      return initialState;
    },
  },
});

export const {
  updateUserDataState,
  logoutUser
} = userSlice.actions;

export default userSlice.reducer;