import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postList: [],
  currentPage: 1,
  selected: [],
  // searchOptions: {
  //   selectBox1: '제목',
  //   selectBox2: '전체',
  //   inputValue: '',
  // },
};

export const userPostSlice = createSlice({
  name: 'userPost',
  initialState,
  reducers: {
    prev: (state) => {
      state.currentPage -= 1;
    },
    next: (state) => {
      state.currentPage += 1;
    },
    searchReset: (state, action) => {
      state = { ...state, ...action.payload };
    },
    updatePostList: (state, action) => {
      state.postList = [...state.postList, ...action.payload];
    },
    // updateSearch: (state, action) => {
    //   state.searchOptions = {
    //     ...state.searchOptions,
    //     ...action.payload,
    //   };
    //   console.log(state.searchOptions);
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

export const { prev, next, searchReset, updatePostList } =
  userPostSlice.actions;
export default userPostSlice.reducer;
export const selectUserPost = (state) => state.userPost;
