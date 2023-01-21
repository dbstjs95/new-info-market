import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Comment from '../../component/content/Comment';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  updatePostState,
  selectSelectedPost,
  addLike,
  cancelLike,
  cancelModify,
  deleteFile,
} from '../../store/slices/selectedPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import Setting from '../../component/content/Setting';
import Modal from '../../modals/Modal-1';
import FileChange from '../../component/content/FileChange';
import File from '../../images/file.png';

const EntireContainer = styled.div`
  * {
    font-family: '순천R';
    /* border: 1px solid red; */
  }
  padding: 20px 0;
  background-color: rgba(217, 213, 204, 0.3);
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Container = styled.div`
  width: 800px;
  border: 1px solid lightgrey;
  > .title {
    font-family: '순천B';
    padding: 15px;
    background-color: white;
    word-break: break-all;
  }
  > .info {
    background-color: white;
    padding: 10px;
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div.details {
      display: flex;
      > dl {
        position: relative;
        color: #444;
        font-size: 0.9rem;
        display: flex;
        padding-right: 10px;
        &:not(:first-of-type) {
          /* &::before {
            content: '|';
            position: absolute;
            display: block;
            top: 0;
            left: 0;
            color: #666;
          } */
          > dt {
            padding-left: 7px;
            border-left: 1px dotted gray;
          }
        }
        > dt {
          color: black;
          padding-right: 7px;
        }
        > dd {
        }
      }

      @media screen and (max-width: 480px) {
        flex-direction: column;
        > dl {
          padding-right: 0;
          &:not(:first-of-type) {
            > dt {
              padding-left: 0;
              border: 0;
            }
          }
          &:not(:last-of-type) {
            padding-bottom: 5px;
          }
        }
      }
    }
  }
`;

const SettingBox = styled.span`
  display: flex;
  align-items: center;
  padding-right: 5px;
  position: relative;
  &.not_logined {
    display: none;
  }
`;

const Like = styled.div`
  /* margin-top: 15px;
  display: flex;
  justify-content: center;
  font-size: 30px; */
  /* margin-right: 30px; */
  font-size: 1.5rem;
`;

// css 수정사항 - float 설정
const LikeDownload = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: white;
  border-top: 1px solid lightgray;
`;

const EditConfirmBox = styled(LikeDownload)`
  justify-content: flex-end;
  > button {
    font-size: 0.9rem;
    border: 0;
    padding: 3px 7px;
    color: white;
    &:first-of-type {
      margin-right: 20px;
      background-color: #777;
    }
    &:nth-of-type(2) {
      background-color: #025896;
    }
  }
`;

const RemoveBox = styled.div`
  width: 200px;
  > div {
    padding-top: 15px;
    text-align: right;
    > button {
      border: 0;
      font-size: 0.9rem;
      padding: 0 3px;
      cursor: pointer;
      &:first-of-type {
        margin-right: 15px;
      }
      &:hover {
        background-color: orangered;
        color: white;
        &:first-of-type {
          background-color: #1a8a25;
        }
      }
    }
  }
`;

const ContentBox = styled.textarea`
  width: 100%;
  min-height: 400px;
  padding: 10px;
  font-size: 1rem;
  border: 0;
  resize: none;
  border-bottom: 1px solid lightgray;
  outline: none;
  word-break: break-all;
  // 줄 간격
  line-height: 1.7rem;
`;

const TitleEditBox = styled.input`
  width: 100%;
  padding: 5px;
  outline-color: crimson;
`;

const ContentEditBox = styled.textarea`
  width: 100%;
  resize: none;
  padding: 10px;
  outline-color: crimson;
  word-break: break-all;
`;

function RemoveInfoConfirm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accToken } = useSelector(selectUserInfo);
  const { id: infoId } = useSelector(selectSelectedPost);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const handleInfoDelete = () => {
    //게시글 첨부파일도 삭제해야 함!!
    axios
      .delete(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}`,
        getConfig,
      )
      .then((res) => {
        dispatch(deleteFile());
        alert(res.data.message);
      })
      .catch((err) => alert(err.response.message));

    dispatch(updatePostState({ removeInfo: false }));
    navigate(-1); //다시 렌더링되는지 확인
  };

  return (
    <RemoveBox>
      <p>정말 삭제하시겠습니까?</p>
      <div>
        <button onClick={handleInfoDelete}>확인</button>
        <button
          onClick={() => dispatch(updatePostState({ removeInfo: false }))}
        >
          취소
        </button>
      </div>
    </RemoveBox>
  );
}

function ContentFree({ use = '' }) {
  const dispatch = useDispatch();
  const {
    id: infoId,
    userId,
    title,
    nickname,
    content,
    totalLikes,
    reviews,
    totalViews,
    like,
    createdAt,
    updatedAt,
    fileURL,
    isOpen,
    removeInfo,
    infoEditMode,
    titleChange,
    contentChange,
    fileChange,
    modifyTextStep,
    modyfiedFileName,
  } = useSelector(selectSelectedPost);

  const { id, isLogin, accToken } = useSelector(selectUserInfo);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const likeClick = () => {
    //자신의 게시물이면 좋아요 못 누름.
    if (id === userId)
      return alert('자신의 게시물에는 좋아요를 누를 수 없습니다.');
    if (like) {
      //좋아요 취소.
      axios
        .delete(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/like`,
          getConfig,
        )
        .then((res) => {
          dispatch(cancelLike());
          dispatch(updatePostState({ like: !like }));
        })
        .catch((err) => alert('좋아요 취소 반영 안 됨.'));
    } else {
      // 좋아요 누름.
      axios
        .put(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/like`,
          '',
          getConfig,
        )
        .then((res) => {
          dispatch(addLike());
          dispatch(updatePostState({ like: !like }));
        })
        .catch(
          (err) =>
            err.response.data?.message && alert(err.response.data.message),
        );
    }
  };

  //텍스트 수정 처리,
  useEffect(() => {
    if (!modifyTextStep) return;
    axios
      .put(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}`,
        {
          type: 'Free',
          title: localTitle,
          content: localContent,
          file: modyfiedFileName,
          targetPoint: 0,
        },
        postConfig,
      )
      .then((res) => {
        dispatch(
          updatePostState({
            title: localTitle,
            content: localContent,
            fileURL: modyfiedFileName,
          }),
        );
      })
      .catch((err) => {
        //실패했으면 브라우저상 변화가 반영이 안되어야 함.
        setLocalTitle(title);
        setLocalContent(content);
        if (err.response.data?.message) alert(err.response.data.message);
      });

    dispatch(cancelModify());
  }, [modifyTextStep]);

  const handleCloseModal = useCallback(() => {
    dispatch(updatePostState({ isOpen: false }));
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener('click', handleCloseModal);
    return () => {
      window.removeEventListener('click', handleCloseModal);
    };
  }, []);

  //텍스트, 파일 수정 단계를 분리시켜주는 코드
  const handleModifyReady = () => {
    if (!titleChange && !contentChange && !fileChange)
      return dispatch(updatePostState({ infoEditMode: false }));

    if (fileChange)
      return dispatch(
        updatePostState({
          modifyFileStep: true,
        }),
      );

    dispatch(
      updatePostState({
        modifyTextStep: true,
      }),
    );
  };

  return (
    <EntireContainer>
      <ContentContainer>
        {removeInfo && (
          <Modal
            handleBtnClick={() =>
              dispatch(updatePostState({ removeInfo: false }))
            }
            content={<RemoveInfoConfirm />}
            role="remove"
          />
        )}
        <Container>
          {infoEditMode ? (
            <TitleEditBox
              type="text"
              onChange={(e) => {
                setLocalTitle(e.target.value);
                dispatch(updatePostState({ titleChange: true }));
              }}
              defaultValue={localTitle}
            />
          ) : (
            <div className="title">{title}</div>
          )}
          <div className="info">
            <div className="details">
              <dl>
                <dt>작성자</dt>
                <dd>{nickname}</dd>
              </dl>
              <dl>
                <dt>작성일자</dt>
                <dd>{createdAt}</dd>
              </dl>
              <dl>
                <dt>조회수</dt>
                <dd>{totalViews}</dd>
              </dl>
              <dl>
                <dt>추천수</dt>
                <dd>{totalLikes}</dd>
              </dl>
            </div>
            <SettingBox className={`setting ${isLogin ? '' : 'not_logined'}`}>
              <FontAwesomeIcon
                icon={isOpen ? faCircleMinus : faGear}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!localTitle || !localContent) {
                    setLocalTitle(title);
                    setLocalContent(content);
                  }
                  dispatch(updatePostState({ isOpen: !isOpen }));
                }}
              />
              {isOpen && <Setting />}
            </SettingBox>
          </div>
          {infoEditMode ? (
            <ContentEditBox
              rows="20"
              onChange={(e) => {
                setLocalContent(e.target.value);
                dispatch(updatePostState({ contentChange: true }));
              }}
              defaultValue={localContent}
            />
          ) : (
            <ContentBox readOnly className="body" defaultValue={content} />
          )}
          <LikeDownload>
            {!infoEditMode && (
              <Like onClick={likeClick} style={{ cursor: 'pointer' }}>
                {like ? '♥' : '♡'} {totalLikes}
              </Like>
            )}
            {/* 아래 첨부파일은 회원만 다운 가능 */}
            {infoEditMode ? (
              <FileChange />
            ) : (
              fileURL && (
                <a
                  href={
                    isLogin
                      ? `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_AWS_DEFAULT_REGION}.amazonaws.com/${fileURL}`
                      : '#'
                  }
                >
                  <img
                    style={{
                      width: '2rem',
                      cursor: 'pointer',
                      display: 'block',
                    }}
                    src={File}
                    alt="파일"
                    onClick={() =>
                      !isLogin && alert('회원만 가능한 서비스입니다.')
                    }
                  />
                </a>
              )
            )}
          </LikeDownload>
          {infoEditMode && (
            <EditConfirmBox>
              <button onClick={() => dispatch(cancelModify())}>취소</button>
              <button onClick={handleModifyReady}>수정 완료</button>
            </EditConfirmBox>
          )}
          {!infoEditMode && <Comment />}
        </Container>
      </ContentContainer>
    </EntireContainer>
  );
}

export default ContentFree;
