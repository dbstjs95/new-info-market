import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  selectSelectedPost,
  addComment,
  deleteComment,
  modifyComment,
} from '../../store/slices/selectedPost';
import axios from 'axios';

const CommentWrapper = styled.div`
  border: 1px solid black;
  p {
    margin: 0;
  }
`;
const UserInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eeeeee;
`;
const Button = styled.button`
  border: 0;
  height: 20px;
  background: none;
  display: none;
  &.authorized {
    display: inline-block;
  }
`;

function Comment() {
  const dispatch = useDispatch();
  const { id: infoId, reviews } = useSelector(selectSelectedPost);
  const userInfo = useSelector(selectUserInfo);

  const [input, setInput] = useState('');
  const [modifyVal, setModifyVal] = useState('');
  const [editMode, setEditMode] = useState(false);
  const textEl = useRef(null);

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${userInfo.accToken}`,
    },
    withCredentials: true,
  };
  const getConfig = {
    headers: {
      Authorization: `Bearer ${userInfo.accToken}`,
    },
    withCredentials: true,
  };

  //댓글 입력
  const handleChange = (e, type) => {
    if (type === 'input') return setInput(e.target.value);
    if (type === 'modify') return setModifyVal(e.target.value);
  };

  // 댓글 추가
  const add = () => {
    if (!input) return alert('댓글을 작성해주세요.');

    axios
      .post(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/reply`,
        { content: input },
        postConfig,
      )
      .then((res) => {
        const { id: replyId, createdAt } = res.data;
        dispatch(
          addComment({
            id: replyId,
            nickname: userInfo.nickname,
            userId: userInfo.id,
            content: input,
            createdAt,
          }),
        );
        setInput('');
      })
      .catch((err) => alert('댓글 작성 실패'));
  };

  // 코멘트 삭제
  const remove = (replyId) => {
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/reply/${replyId}`,
        getConfig,
      )
      .then((res) => {
        const { reply } = res.data;
        if (String(replyId) === String(reply.id)) {
          dispatch(deleteComment({ replyId }));
        }
      })
      .catch((err) => alert('댓글 삭제 실패'));
  };

  //댓글 수정 완료
  const chagneContent = (replyId) => {
    if (!modifyVal) return alert('댓글을 작성해주세요.');
    axios
      .put(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/reply/${replyId}`,
        { content: modifyVal },
        postConfig,
      )
      .then((res) => {
        const { updatedAt } = res.data;
        dispatch(
          modifyComment({
            id: replyId,
            content: modifyVal,
            updatedAt,
          }),
        );
        setModifyVal('');
        setEditMode(false);
      })
      .catch((err) => alert('댓글 수정 실패'));
  };

  useEffect(() => {
    if (!editMode) return;
    textEl.current.focus();
  }, [editMode]);

  return (
    <div style={{ border: '3px solid red' }}>
      <textarea
        value={input}
        onChange={(e) => handleChange(e, 'input')}
        placeholder="댓글을 작성하려면 로그인 해주세요."
        disabled={!userInfo.isLogin}
      />
      <button onClick={add} disabled={!userInfo.isLogin}>
        등록
      </button>
      {reviews.map((R) => (
        <CommentWrapper key={R.id}>
          <UserInfoWrapper>
            <p>작성자 : {R.nickname}</p>
            <p>작성일자 : {R.createdAt}</p>
            <Button
              className={
                (R.userId === userInfo.id || userInfo.grade === 'admin') &&
                'authorized'
              }
              onClick={() => remove(R.id)}
            >
              삭제
            </Button>
            <Button
              className={R.userId === userInfo.id && 'authorized'}
              onClick={() => setEditMode(false)}
            >
              수정
            </Button>
          </UserInfoWrapper>
          {editMode ? (
            <div>
              <textarea
                cols="30"
                rows="10"
                ref={textEl}
                value={modifyVal}
                onChange={(e) => handleChange(e, 'modify')}
              >
                {R.content}
              </textarea>
              <button onClick={() => chagneContent(R.id)}>등록</button>
              <button>취소</button>
            </div>
          ) : (
            <div>{R.content}</div>
          )}
        </CommentWrapper>
      ))}
    </div>
  );
}

export default Comment;
