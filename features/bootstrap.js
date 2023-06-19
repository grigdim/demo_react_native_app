import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  analytics: [],
  audit: [],
  box: {},
};

export const bootstrap = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
    },
    setAudit: (state, action) => {
      state.audit = action.payload;
    },
    setBox: (state, action) => {
      state.box = action.payload;
    },
  },
});

export const {setAnalytics, setAudit, setBox} = bootstrap.actions;

export const selectAnalytics = state => state.stores.analytics;
export const selectAudit = state => state.stores.audit;
export const selectBox = state => state.stores.box;

export default bootstrap.reducer;
