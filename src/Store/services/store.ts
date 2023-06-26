import { api } from '../../features/index';
import authReducer from '../../features/authSlice';
import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  PERSIST,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: ['api'],
  stateReconciler: autoMergeLevel2,
};

const rootReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer<any, AnyAction>(
  persistConfig,
  rootReducer,
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REGISTER, PERSIST, PURGE],
      },
    }).concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
