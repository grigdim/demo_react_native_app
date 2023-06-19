import {configureStore} from '@reduxjs/toolkit';
import bootstrap from './features/bootstrap';

export const store = configureStore({
  reducer: {stores: bootstrap},
});
