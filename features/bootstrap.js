import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  analytics: [],
  audit: [],
  box: {},
  token: null,
  storeId: null,
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
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setStoreId: (state, action) => {
      state.storeId = action.payload;
    },
  },
});

export const {setAnalytics, setAudit, setBox, setToken, setStoreId} =
  bootstrap.actions;

export const selectAnalytics = state => state.stores.analytics;
export const selectAudit = state => state.stores.audit;
export const selectBox = state => state.stores.box;
export const selectToken = state => state.stores.token;
export const selectStoreId = state => state.stores.storeId;

export default bootstrap.reducer;
