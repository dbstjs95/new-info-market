import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Comment from '../../component/content/Comment';
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import {
  updatePostState,
  selectSelectedPost,
  addLike,
  cancelLike,
  cancelModify,
  deleteFile,
} from '../../store/slices/selectedPost';
import {
  confirmPay,
  selectPoint,
  updatePointState,
} from '../../store/slices/point';
import ChargeBox, { PayWithPoints } from '../../component/ChargeBox';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileArrowDown,
  faGear,
  faCircleMinus,
} from '@fortawesome/free-solid-svg-icons';
import Setting from '../../component/content/Setting';
import Modal from '../../modals/Modal-1';
import FileChange from '../../component/content/FileChange';
import File from '../../images/file.png';

const EntireContainer = styled.div`
  * {
    box-sizing: border-box;
    word-break: keep-all;
    font-family: 'Elice Bold';
    font-family: '순천B';
  }
`;

const ContentContainer = styled.div`
  width: 100vw;
  /* height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  div.modal div.content {
    &.payment {
      /* 모달창 배경색 */
      background-color: #f3f702;
    }
  }
`;

const Container = styled.div`
  width: 800px;
  border-radius: 10px;
  border: 2px solid black;
  background-color: white;
  > .title {
    padding: 15px;
    border-bottom: 1px solid #999;
  }
  > .info {
    padding: 15px;
    border-bottom: 1px solid #999;
    > dl {
      position: relative;
      display: inline-block;
      padding: 0 20px;
      > :first-child {
        padding-left: 0;
      }
      > ::before {
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        width: 1px;
        height: 25px;
        background: #ddd;
      }
      > :first-child::before {
        display: none;
      }
      > dt,
      dd {
        display: inline-block;
      }
      > dd {
        margin-left: 10px;
        color: gray;
      }
    }
  }
  > .body {
    display: inline-block;
    padding: 15px;
    border-bottom: 1px solid #000;
    line-height: 160%;
    font-size: 1.2rem;
  }
`;

const Like = styled.div`
  font-size: 1.5rem;
`;

const LikeDownload = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  > button.paid-btn {
    padding: 7px;
  }
`;

const LeftBtns = styled.span`
  display: flex;
  min-width: 50%;
  justify-content: space-between;
  align-items: center;
  > span.purchased {
    color: red;
  }
`;

const Btns = styled.span`
  width: 150px;
  display: flex;
  justify-content: space-between;
  > button {
    font-size: 1rem;
  }
`;

const SettingBox = styled.span`
  position: relative;
  bottom: 15px;
  &.logined {
    display: none;
  }
`;

const RemoveBox = styled.div``;

const ContentBox = styled.textarea`
  width: 100%;
  height: 500px;
  padding: 10px;
  box-sizing: border-box;
  font-size: 1rem;
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
      <p>삭제하시겠습니까?</p>
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

function ContentPaid() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    id: infoId,
    userId, //userId: writer,
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
    targetPoint,
    isPurchased,
  } = useSelector(selectSelectedPost);

  const { modalOpen } = useSelector(selectPoint);

  //id: userInfoId
  const { id, accToken, isLogin, grade, point } = useSelector(selectUserInfo);
  const [localTitle, setLocalTitle] = useState(title);
  const [localContent, setLocalContent] = useState(content);

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
    //로그인해야 누를 수 있음.
    if (!isLogin) return alert('로그인 해주세요.');
    //자신의 게시물이면 좋아요 못 누름.
    if (id === userId)
      //유저의 userId와 게시글 userId가 같으면 동일인물
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

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isLogin) return alert('로그인 해주세요');
    if (id === userId)
      //유저의 userId와 게시글 userId가 같으면 동일인물
      return alert('자신의 게시물은 구매할 수 없습니다.');
    //포인트 부족 --> 충전)
    if (Number(targetPoint) > Number(point)) {
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

  //텍스트 수정 처리
  useEffect(() => {
    console.log('@@@', localTitle, localContent);
    if (!modifyTextStep) return;
    axios
      .put(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}`,
        {
          type: 'Paid',
          title: localTitle,
          content: localContent,
          file: modyfiedFileName,
          targetPoint,
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
        {/* 결제하기전 확인 단계 */}
        {preStep && (
          <Modal
            handleBtnClick={() => setPreStep(false)}
            content={<PayWithPoints handleClick={() => setPreStep(false)} />}
          />
        )}
        {/* 결제 모달 */}
        {modalOpen && (
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
            <textarea
              rows="1"
              style={{
                height: '2rem',
                overflow: 'auto',
                width: '100%',
                fontSize: '1rem',
                lineHeight: '1rem',
              }}
              onChange={(e) => {
                setLocalTitle(e.target.value);
                dispatch(updatePostState({ titleChange: true }));
              }}
              value={localTitle}
            />
          ) : (
            <div className="title">{title}</div>
          )}
          <div className="info">
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
            <dl>
              <dt>포인트</dt>
              <dd>{targetPoint}</dd>
            </dl>
            <dl style={{ float: 'right' }}>
              <SettingBox className={`setting ${isLogin || 'logined'}`}>
                {/* 설정 버튼 */}
                <FontAwesomeIcon
                  icon={isOpen ? faCircleMinus : faGear}
                  onClick={() => {
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
            </dl>
          </div>
          {/* content 편집 모드 */}
          {infoEditMode ? (
            <textarea
              // cols="30"
              rows="20"
              style={{
                width: '100%',
                fontSize: '1.2rem',
                lineHeight: '1.5em',
              }}
              onChange={(e) => {
                setLocalContent(e.target.value);
                dispatch(updatePostState({ contentChange: true }));
              }}
              value={localContent}
            />
          ) : (
            <ContentBox readOnly className="body" value={content} />
          )}

          {/* 좋아요, 구매이력 설명, 다운로드, 결제하기 묶기 */}
          <LikeDownload>
            <LeftBtns>
              {/* 좋아요 버튼 클릭 */}
              {infoEditMode || (
                <Like onClick={likeClick} style={{ cursor: 'pointer' }}>
                  {like ? '♥' : '♡'} {totalLikes}
                </Like>
              )}

              {/* 첨부파일 편집모드 */}
              {infoEditMode ? (
                <FileChange />
              ) : (
                // 첨부파일이 있어야 다운로드 링크가 뜸
                fileURL && (
                  <a
                    href={
                      isPurchased || id === userId || grade === 'admin'
                        ? `https://${process.env.REACT_APP_AWS_BUCKET}.s3.${process.env.REACT_APP_AWS_DEFAULT_REGION}.amazonaws.com/${fileURL}`
                        : '#'
                    }
                  >
                    <img
                      style={{ width: '2rem', cursor: 'pointer' }}
                      src={File}
                      alt="파일"
                      onClick={() =>
                        !isLogin && alert('회원만 가능한 서비스입니다.')
                      }
                    />
                  </a>
                )
              )}
              {/* 결제한 이력이 있을 때만 나타나는 문구 */}
              {isPurchased && !infoEditMode && (
                <span className="purchased">
                  구매한 이력이 있는 게시물입니다.
                </span>
              )}
            </LeftBtns>
            {/* 편집모드에만 나타나는 버튼  */}
            {infoEditMode && (
              <Btns>
                <button onClick={handleModifyReady}>수정 완료</button>
                <button onClick={() => dispatch(cancelModify())}>취소</button>
              </Btns>
            )}
            {/* 결제버튼 */}
            {infoEditMode || (
              <button className="paid-btn" onClick={handleConfirm}>
                결제하기
              </button>
            )}
          </LikeDownload>
          {infoEditMode || <Comment />}
        </Container>
      </ContentContainer>
    </EntireContainer>
  );
}

export default ContentPaid;
