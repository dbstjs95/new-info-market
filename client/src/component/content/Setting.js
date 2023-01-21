import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  updatePostState,
  selectSelectedPost,
} from '../../store/slices/selectedPost';
import { selectUserInfo } from '../../store/slices/userInfo';

const PopUpBox = styled.ul`
  background-color: #fff;
  position: absolute;
  top: calc(100% + 1px);
  right: -10px;
  z-index: 10000;
  border: 1px solid lightgray;
  box-shadow: -2px 3px 7px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px 0 5px 5px;
  overflow: hidden;
  > li {
    font-size: 0.9rem;
    padding: 7px 10px;
    white-space: nowrap;
    text-align: center;
    &:hover {
      background-color: #f4f4f4;
      cursor: pointer;
    }
    &:not(:last-of-type) {
      border-bottom: 1px solid lightgray;
    }
  }
`;

function Setting({ setAgain }) {
  const dispatch = useDispatch();

  const { grade, isLogin, id: userId, accToken } = useSelector(selectUserInfo);
  const { id: infoId, userId: writer } = useSelector(selectSelectedPost);

  return (
    <PopUpBox className="popup">
      {grade === 'admin' || writer === userId ? (
        <>
          <li onClick={() => dispatch(updatePostState({ infoEditMode: true }))}>
            수정
          </li>
          <li onClick={() => dispatch(updatePostState({ removeInfo: true }))}>
            삭제
          </li>
        </>
      ) : (
        <li>신고하기</li>
      )}
    </PopUpBox>
  );
}

export default Setting;
