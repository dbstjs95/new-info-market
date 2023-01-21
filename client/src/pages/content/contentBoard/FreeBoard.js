import React from 'react';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faEye, faUser } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../../store/slices/userInfo';
import { clearPostState } from '../../../store/slices/selectedPost';
import { useNavigate } from 'react-router-dom';

const OrderContainer = styled.div`
  background-color: #ccc7a9;
  opacity: 0.9;
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* box-shadow: 3px 5px 4px #75746d; */
  > div {
    /* border: 3px solid red; */
    width: 50%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    > span {
      /* border: 2px solid blue; */
      font-family: '순천B';
      &.latest_best {
        /* width: 250px; */
        /* padding: 3% 2%; */
        /* margin-left: -5px; */
        min-width: 30%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > input {
          display: none;
        }
      }

      &.count {
        display: flex;
        align-items: center;
      }

      > label {
        font-family: '순천B';
        font-size: 1rem;
        /* border: 1px solid red; */
        height: 100%;
        /* padding: 0 3%; */
        display: flex;
        width: 50%;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
      }
      > label.clicked {
        background-color: #69675c;
        box-shadow: 3px 5px 4px #3b3a37;
        color: white;
        font-size: 1rem;
      }
    }
  }
`;

const EntireContainer = styled.div`
  display: flex;
  /* background-color: #faf9f5; */
  flex-direction: column;
  align-items: center;
  height: 800px;
  overflow-y: scroll;
  > ul.postList {
    /* border: 3px solid red; */
    margin: 0;
    list-style: none;
    padding: 0;
    width: 50%;
    height: 1200px;
    padding: 1%;
    > li.post {
      border: 1px solid black;
      background-color: white;
      width: 100%;
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      > div.writer_createdAt {
        /* border: 1px dotted black; */
        padding: 5px;
        display: flex;
        justify-content: space-between;
        > span {
          /* border: 2px dotted purple; */
          &.writer {
            > span.icon {
              margin-right: 10px;
            }
          }
          &.createdAt {
          }
        }
      }
      > p.title {
        border: 1px solid lightgray;
        box-shadow: 2px 2px 2px lightgray;
        margin: 0;
        padding: 5px;
        margin-top: 3px;
        margin-bottom: 2px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
      }
      > div.total_Likes_Views {
        /* border: 1px dotted black; */
        padding: 5px;
        display: flex;
        justify-content: space-between;
        > span {
          /* border: 1px dotted orange; */
          &.totalLikes {
          }
        }
      }
    }
  }
`;

function Post({ post }) {
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
  } = post;

  const navigate = useNavigate();
  const day = createdAt.split('T')[0];

  return (
    <li className="post">
      <div className="writer_createdAt">
        <span className="writer">
          <span className="icon">
            <FontAwesomeIcon icon={faUser} />
          </span>
          {nickname}
        </span>
        <span className="createdAt">{day}</span>
      </div>
      <p
        className="title"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(`/main/search/${postId}`)}
      >
        {title}
      </p>
      <div className="total_Likes_Views">
        <span className="totalLikes">
          <FontAwesomeIcon icon={faThumbsUp} /> {totalLikes}
        </span>
        <span className="totalViews">
          <FontAwesomeIcon icon={faEye} /> {totalViews}
        </span>
      </div>
    </li>
  );
}

function FreeBoard() {
  const dispatch = useDispatch();
  const { accToken } = useSelector(selectUserInfo);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [order, setOrder] = useState('최신순');
  const LIMIT = 10;
  const elm = useRef(null);

  //서버 통신 헤더: post용, get용
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };
  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  useEffect(() => {
    dispatch(clearPostState());
    if (totalCnt && list.length >= totalCnt) return;
    const params = {
      info_type: 'Free',
      pages: page,
      limit: LIMIT,
      like_type: order === '인기순',
      lastId: list[list.length - 1]?.id || 0,
    };
    // /info/free/list
    const infoURL = `${process.env.REACT_APP_SERVER_DEV_URL}/info/free/list`;

    axios
      .get(infoURL, {
        params,
        ...getConfig,
      })
      .then((res) => {
        const { rows, count } = res.data.info;
        if (rows) setList([...list, ...rows]);
        if (count && page === 1) {
          setTotalCnt(count);
        }
      })
      .catch((err) => {
        if (err.response?.message) alert(err.response.message);
      });
  }, [page, order]);

  const handleScroll = (e) => {
    if (e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight)
      setPage((prevState) => prevState + 1);
  };

  const handleChange = (e) => {
    setOrder(e.target.value);
    setList([]);
    setPage(1);
  };

  return (
    <>
      <OrderContainer>
        <div>
          <span className="latest_best">
            <input
              id="latest"
              className="latest"
              type="radio"
              name="info_order"
              value="최신순"
              checked={order === '최신순'}
              onChange={handleChange}
            />
            <label for="latest" className={order === '최신순' && 'clicked'}>
              최신순
            </label>
            <input
              id="best"
              className="best"
              type="radio"
              name="info_order"
              value="인기순"
              checked={order === '인기순'}
              onChange={handleChange}
            />
            <label for="best" className={order === '인기순' && 'clicked'}>
              인기순
            </label>
          </span>
          <span className="count">총 게시물 수 : {totalCnt || 0}</span>
        </div>
      </OrderContainer>
      <EntireContainer id="box" ref={elm} onScroll={handleScroll}>
        <ul className="postList">
          {list.map((post) => (
            <Post key={post.id} post={post} />
          ))}
          {/*{isLoading && <Loading/>}*/}
        </ul>
      </EntireContainer>
    </>
  );
}

export default FreeBoard;
