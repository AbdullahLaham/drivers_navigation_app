import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// إعداد `redux-persist`
const persistConfig = {
  key: 'auth', // مفتاح التخزين في AsyncStorage
  storage: AsyncStorage, // استخدام AsyncStorage للتخزين
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // استخدام الـ persistReducer بدلاً من الـ reducer العادي
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // تعطيل الفحص التسلسلي لمنع الأخطاء
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
