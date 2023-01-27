import { configureStore } from '@reduxjs/toolkit';
import userInfoReducer from './slices/userInfo';
import pointReducer from './slices/point';
import searchReducer from './slices/search';
import selectedPostReducer from './slices/selectedPost';

export default configureStore({
  reducer: {
    userInfo: userInfoReducer,
    point: pointReducer,
    search: searchReducer,
    selectedPost: selectedPostReducer,
  },
});
