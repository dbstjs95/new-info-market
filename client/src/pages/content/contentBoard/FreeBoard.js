import React from 'react';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { clearPostState } from '../../../store/slices/selectedPost';
import { useNavigate } from 'react-router-dom';

const Outer = styled.div`
  width: 800px;
  margin: 0 auto;
  * {
    /* border: 1px solid red; */
  }
  @media screen and (max-width: 900px) {
    width: 100%;
  }
  > div.order {
    * {
      font-family: '순천B';
    }
    background-color: #ccc7a9;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    > p:first-of-type {
      > span {
        border-radius: 5px;
        padding: 18px;
        cursor: pointer;
        &:first-of-type {
          margin-right: 10px;
        }
        &:hover {
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.2);
        }
        &.clicked {
          background-color: #69675c;
          box-shadow: 3px 2px 4px #3b3a37;
          color: white;
        }
      }
    }
    @media screen and (max-width: 480px) {
      padding: 13px;
      * {
        font-size: 0.9rem;
      }
      > p:first-of-type {
        > span {
          padding: 15px;
          &:first-of-type {
            margin-right: 7px;
          }
        }
      }
    }
  }
`;

const EntireContainer = styled.ul`
  padding: 30px 15px;
  height: 800px;
  overflow-y: scroll;
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
  }
  > li.post {
    box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.3);
    background-color: #f9fae3;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.2s linear;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &:hover {
      transform: scale(101%);
      box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.3);
      z-index: 1;
    }
    > div.writer_createdAt {
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      * {
        font-size: 0.9rem;
      }
      > span {
        &.writer {
          color: #705e06;
          > span.icon {
            margin-right: 10px;
          }
        }
        &.createdAt {
          color: #444;
        }
      }
    }
    > div.title {
      font-family: '순천B';
      border: 1px solid lightgray;
      box-shadow: 2px 2px 2px lightgray;
      padding: 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #333;
      &:hover {
        color: crimson;
      }
    }
    > div.likes_views {
      font-size: 0.9rem;
      color: #444;
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      > span {
        &.likes {
          margin-right: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          > span.text {
            margin-left: 4px;
          }
        }
        &.views {
          > em {
            font-weight: bold;
          }
        }
      }
    }
    > div.likes_views_point {
      font-size: 0.9rem;
      color: #444;
      padding: 7px 10px;
      display: flex;
      justify-content: space-between; // 다름.
      align-items: center;
      > .left {
        font-weight: bold;
        /* background-color: #ba931c; */
        background-color: #c99c12;
        color: white;
        padding: 5px 5px 2px;
        border-radius: 3px;
      }
      > .right {
        display: flex;
        > span {
          &.likes {
            margin-right: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span.text {
              margin-left: 4px;
            }
          }
          &.views {
            > em {
              font-weight: bold;
            }
          }
        }
      }
    }
  }
`;

function Post({ post, paid }) {
  const {
    id: postId,
    title,
    nickname,
    content,
    totalLikes,
    totalViews,
    createdAt,
    updatedAt,
    userId,
    targetPoint,
  } = post;

  const navigate = useNavigate();
  const day = createdAt.split('T')[0];

  return (
    <li className="post" onClick={() => navigate(`/main/search/${postId}`)}>
      <div className="writer_createdAt">
        <span className="writer">
          <span className="icon">
            <FontAwesomeIcon icon={faUser} />
          </span>
          {nickname}
        </span>
        <span className="createdAt">{day}</span>
      </div>
      <div className="title">{title}</div>
      {paid ? (
        <div className="likes_views_point">
          <div className="left">{targetPoint} P</div>
          <div className="right">
            <span className="likes">
              <FontAwesomeIcon icon={faThumbsUp} />
              <span className="text">{totalLikes}</span>
            </span>
            <span className="views">
              <em>view</em> {totalViews}
            </span>
          </div>
        </div>
      ) : (
        <div className="likes_views">
          <span className="likes">
            <FontAwesomeIcon icon={faThumbsUp} />
            <span className="text">{totalLikes}</span>
          </span>
          <span className="views">
            <em>view</em> {totalViews}
          </span>
        </div>
      )}
    </li>
  );
}

function FreeBoard({ paid }) {
  const dispatch = useDispatch();
  const accToken = localStorage.getItem('act');

  const elm = useRef(null);
  const LIMIT = 10;
  const InitialObj = {
    page: 1,
    order: '최신순',
  };

  const [typeState, setTypeState] = useState(paid ? 'paid' : 'free');
  const [list, setList] = useState([]);
  const [totalCnt, setTotalCnt] = useState(0);
  const [pagingInfo, setPagingInfo] = useState(InitialObj);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const handleScroll = (e) => {
    if (e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight)
      setPagingInfo((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handleOrder = (val) => {
    setList(() => []);
    setTotalCnt(() => 0);
    setPagingInfo(() => ({ page: 1, order: val }));
  };

  const getInfoList = (infoObj) => {
    let { page, order } = infoObj;
    if (totalCnt && list.length >= totalCnt) return;
    const params = {
      info_type: paid ? 'Paid' : 'Free',
      pages: page,
      limit: LIMIT,
      like_type: order === '인기순',
      lastId: list[list.length - 1]?.id || 0,
    };

    // /info/free/list
    const infoURL = `${process.env.REACT_APP_SERVER_DEV_URL}/info/${
      paid ? 'paid' : 'free'
    }/list`;

    axios
      .get(infoURL, {
        params,
        ...getConfig,
      })
      .then((res) => {
        const { rows, count } = res.data.info;
        if (rows) setList((prev) => [...prev, ...rows]);
        if (page === 1) {
          setTotalCnt(count);
        }
      })
      .catch((err) => {
        let errMsg = err.response?.data?.message;
        if (errMsg) alert(errMsg);
      });
  };

  useEffect(() => {
    dispatch(clearPostState());

    let type = paid ? 'paid' : 'free';
    // paid 의존성으로 트리거된 거라면,
    if (typeState !== type) {
      setTypeState(type);
      setList([]);
      setTotalCnt(0);
      setPagingInfo((prev) => ({ page: 1, order: '최신순' }));
    } else {
      getInfoList(pagingInfo);
    }
  }, [paid, pagingInfo]);

  return (
    <Outer>
      <div className="order">
        <p>
          <span
            className={pagingInfo?.order === '최신순' ? 'clicked' : ''}
            onClick={() => handleOrder('최신순')}
          >
            최신순
          </span>
          <span
            className={pagingInfo?.order === '인기순' ? 'clicked' : ''}
            onClick={() => handleOrder('인기순')}
          >
            인기순
          </span>
        </p>
        <p className="count">total: {totalCnt || 0}</p>
      </div>
      <EntireContainer id="box" ref={elm} onScroll={handleScroll}>
        {list?.map((post, idx) => (
          <Post key={idx} post={post} paid={paid} />
        ))}
        {/*{isLoading && <Loading/>}*/}
      </EntireContainer>
    </Outer>
  );
}

export default FreeBoard;
