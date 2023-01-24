import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  updatePostState,
  clearPostState,
  selectSelectedPost,
} from '../../store/slices/selectedPost';
import ContentFree from '../content/ContentFree';

function Post() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postId } = useParams();
  const { id } = useSelector(selectUserInfo);
  const accToken = localStorage.getItem('act');
  const { type } = useSelector(selectSelectedPost);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  useEffect(() => {
    //혹시나 해서 초기화 함. 근데 오류나면 지우기.
    // dispatch(clearPostState());
    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${postId}?userId=${id}`,
        getConfig,
      )
      .then((res) => {
        const { info, like, isPurchased } = res.data;
        console.log('게시물 상세: ', info);
        dispatch(
          updatePostState({
            ...info,
            fileURL: info.file,
            reviews: [...info.Replies],
            like,
            isPurchased,
          }),
        );
      })
      .catch((err) => {
        alert('게시물을 불러올 수 없습니다.');
        navigate(-1);
      });
  }, []);

  return type === 'Free' ? <ContentFree /> : <ContentFree paid={true} />;
}

export default Post;
