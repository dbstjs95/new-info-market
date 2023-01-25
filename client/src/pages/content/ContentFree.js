import React, { useCallback, useEffect, useState } from 'react';
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
import { selectPoint, updatePointState } from '../../store/slices/point';
import ChargeBox, { PayWithPoints } from '../../component/ChargeBox';
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
    cursor: pointer;
    &:first-of-type {
      margin-right: 20px;
      background-color: #777;
    }
    &:nth-of-type(2) {
      background-color: #025896;
    }
    &:hover {
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3);
    }
  }
`;

// paid - PointContainer
const PointContainer = styled(LikeDownload)`
  justify-content: flex-end;
  padding: 10px;
  border: 0;
  border-bottom: 1px solid lightgray;
  font-weight: bold;
  span {
    &:first-child {
      font-size: 0.9rem;
      margin-right: 10px;
      color: #6f02a6;
    }
    &:last-child {
      margin-right: 15px;
      background-color: #aba41b;
      color: white;
      padding: 3px 5px 0;
      border-radius: 10px;
    }
  }
`;

const PayContainer = styled(LikeDownload)`
  justify-content: flex-end;
  > button {
    border: 0;
    background-color: #17ad0c;
    color: white;
    padding: 5px 8px;
    font-weight: bold;
    border-radius: 3px;
    margin: 5px 5px 5px 0;
    &:hover {
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
  }
  > span {
    color: crimson;
    padding: 5px 3px;
  }
  @media screen and (max-width: 380px) {
    justify-content: center;
    > span {
      font-size: 0.9rem;
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
  /* 줄 간격 */
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
  const accToken = localStorage.getItem('act');
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

function ContentFree({ paid }) {
  const navigate = useNavigate();
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
    targetPoint, // paid
    isPurchased, // paid
  } = useSelector(selectSelectedPost);

  // paid version - modalOpen
  const { modalOpen } = useSelector(selectPoint);

  // paid version - grade, point
  const { id, isLogin, grade, point } = useSelector(selectUserInfo);
  const accToken = localStorage.getItem('act');
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

  // paid version - preStep
  const [preStep, setPreStep] = useState(false);

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

  // paid version - handleConfirm
  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isLogin) return alert('로그인 해주세요.');
    if (id === userId)
      //유저의 userId와 게시글 userId가 같으면 동일인물
      return alert('자신의 게시물은 구매할 수 없습니다.');
    //포인트 부족 --> 충전)
    if (Number(targetPoint) > Number(point)) {
      let confirm = window.confirm(
        '잔여 포인트가 부족합니다. 포인트를 충전하시겠습니까?',
      );
      if (!confirm) return;
      dispatch(
        updatePointState({
          modalOpen: true,
        }),
      );
    } else {
      //포인트 충분 --> 결제
      setPreStep(true);
    }
  };

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

  // 브라우저 창 클릭시 열린 세팅 모달 닫힘(1)
  const handleCloseModal = useCallback(() => {
    dispatch(updatePostState({ isOpen: false }));
  }, [isOpen]);

  // 브라우저 창 클릭시 열린 세팅 모달 닫힘(2)
  useEffect(() => {
    window.addEventListener('click', handleCloseModal);
    return () => {
      window.removeEventListener('click', handleCloseModal);
    };
  }, []);

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
        console.log('localContent: ', localContent);
        dispatch(
          updatePostState({
            title: localTitle,
            content: localContent,
            fileURL: modyfiedFileName,
          }),
        );
        alert('수정이 완료되었습니다.');
        navigate('');
      })
      .catch((err) => {
        //실패했으면 브라우저상 변화가 반영이 안되어야 함.
        setLocalTitle(title);
        setLocalContent(content);
        console.error(err?.response?.data?.message);
      })
      .finally(() => dispatch(cancelModify()));
  }, [modifyTextStep]);

  return (
    <EntireContainer>
      <ContentContainer>
        {/* paid: 결제하기전 확인 단계 */}
        {paid && preStep && (
          <Modal
            handleBtnClick={() => setPreStep(false)}
            content={<PayWithPoints handleClick={() => setPreStep(false)} />}
            bg="#fbfced"
          />
        )}
        {/* paid: 결제 모달 */}
        {paid && modalOpen && (
          <Modal
            role="payment"
            handleBtnClick={() =>
              dispatch(
                updatePointState({
                  modalOpen: false,
                }),
              )
            }
            content={<ChargeBox />}
            // bg="#f3f702"
            bg="#f4fa57"
          />
        )}
        {/* 게시물 삭제 확인 모달 */}
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
          {/* title 편집 모드 */}
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
          {/* 게시글 상세정보 */}
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
            {/* 설정 버튼 */}
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
              {/* 설정버튼 클릭--> 메뉴나옴  */}
              {isOpen && <Setting />}
            </SettingBox>
          </div>
          {/* paid: 포인트 정보*/}
          {paid && (
            <PointContainer>
              <span>포인트</span>
              <span>{targetPoint} P</span>
            </PointContainer>
          )}
          {/* content 편집 모드 */}
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
          {/* 좋아요 및 다운로드 */}
          <LikeDownload>
            {!infoEditMode && (
              <Like onClick={likeClick} style={{ cursor: 'pointer' }}>
                {like ? '♥' : '♡'} {totalLikes}
              </Like>
            )}
            {/* 첨부파일 편집모드: 아래 첨부파일은 회원만 다운 가능 */}
            {infoEditMode ? (
              <FileChange />
            ) : (
              // 첨부파일이 있어야 다운로드 링크가 뜸
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
          {/* paid: 결제 여부 또는 결제하기 버튼 */}
          {paid && !infoEditMode && (
            <PayContainer>
              {isPurchased ? (
                <span>구매한 이력이 있는 게시물입니다.</span>
              ) : (
                <button onClick={handleConfirm}>결제하기</button>
              )}
            </PayContainer>
          )}
          {/* 수정 시 나타나는 버튼들 */}
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
