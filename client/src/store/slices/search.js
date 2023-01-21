import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  page: 1,
  mark: 1,
  totalCount: null, //삭제?
  list: [],
  totalPage: 1,
  totalMark: 1,
  markLIMIT: 10,
};

const stateKeys = Object.keys(initialState);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    prev: (state) => {
      state.page -= 1;
    },
    next: (state) => {
      state.page += 1;
    },
    markUp: (state) => {
      state.mark += 1;
    },
    markDowm: (state) => {
      state.mark -= 1;
    },
    updateSearch: (state, action) => {
      for (let key in action.payload) {
        if (stateKeys.includes(key)) state[key] = action.payload[key];
      }
    },
    reset: (state) => {
      console.log('동작..');
      stateKeys.forEach((el) => {
        state[el] = initialState[el];
      });
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

export const { prev, next, markUp, markDowm, updateSearch, reset } =
  searchSlice.actions;
export default searchSlice.reducer;
export const selectSearch = (state) => state.search;
