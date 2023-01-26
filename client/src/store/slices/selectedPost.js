import { createSlice } from '@reduxjs/toolkit';
import AWS from 'aws-sdk';

const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_AWS_DEFAULT_REGION;
const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  apiVersion: '2006-03-01',
});

// const myBucket = new AWS.S3({
//   params: { Bucket: S3_BUCKET },
//   region: REGION,
// });

const initialState = {
  id: null,
  title: null,
  content: null,
  nickname: null,
  targetPoint: 0,
  type: null,
  totalViews: 0,
  totalLikes: 0,
  userId: null,
  createdAt: null,
  updatedAt: null,
  reviews: [],
  like: false,
  isPurchased: false,
  fileURL: null,
  isOpen: false,
  removeInfo: false,
  infoEditMode: false,
  titleChange: false,
  contentChange: false,
  fileChange: false,
  modifyFileStep: false,
  modifyTextStep: false,
  modyfiedFileName: null,
};

const stateKeys = Object.keys(initialState);

export const selectedPostSlice = createSlice({
  name: 'selectedPost',
  initialState,
  reducers: {
    updatePostState: (state, action) => {
      for (let key in action.payload) {
        if (stateKeys.includes(key)) state[key] = action.payload[key];
      }
    },
    clearPostState: (state) => {
      stateKeys.forEach((el) => {
        state[el] = initialState[el];
      });
    },
    addLike: (state) => {
      state.totalLikes += 1;
    },
    cancelLike: (state) => {
      state.totalLikes -= 1;
    },
    addComment: (state, action) => {
      const { reply } = action.payload;
      state.reviews = [reply, ...state.reviews];
    },
    deleteComment: (state, action) => {
      const { replyId } = action.payload;
      state.reviews = state.reviews.filter(
        (R) => String(R.id) !== String(replyId),
      );
    },
    modifyComment: (state, action) => {
      const { id, content, updatedAt } = action.payload;
      state.reviews = state.reviews.map((R) => {
        if (String(R.id) === String(id)) return { ...R, content, updatedAt };
        else return R;
      });
    },
    cancelModify: (state) => {
      state.infoEditMode = false;
      state.titleChange = false;
      state.contentChange = false;
      state.fileChange = false;
      state.modifyTextStep = false;
      state.modyfiedFileName = null;
      state.modifyFileStep = false;
    },
    deleteFile: (state) => {
      // const myBucket = new AWS.S3();
      // const params = {
      //   Bucket: S3_BUCKET,
      //   Key: state.fileName,
      // };
      // myBucket.deleteObject(params, (err, data) => {
      //   if (data) console.log('s3파일 삭제');
      //   if (err) console.log('s3파일 삭제 실패');
      // });
    },
    init: (state) => {
      state.isOpen = false;
      state.removeInfo = false;
      state.infoEditMode = false;
      state.titleChange = false;
      state.contentChange = false;
      state.fileChange = false;
      state.modifyTextStep = false;
      state.modyfiedFileName = null;
      state.modifyFileStep = false;
    },
  },
});

export const {
  updatePostState,
  clearPostState,
  addLike,
  cancelLike,
  addComment,
  deleteComment,
  modifyComment,
  cancelModify,
  deleteFile,
  init,
} = selectedPostSlice.actions;
export default selectedPostSlice.reducer;
export const selectSelectedPost = (state) => state.selectedPost;
