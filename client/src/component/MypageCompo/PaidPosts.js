import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
// import Search from '../Search';
import { useDispatch, useSelector } from 'react-redux';
import { selectPurchaseDetails } from '../../store/slices/purchaseDetails';
import { selectUserInfo } from '../../store/slices/userInfo';
import axios from 'axios';

const EntireContainer = styled.div`
  border-left: 5px solid orange;
  border-right: 5px solid orange;
  background-color: white;
  height: 70%;
  > div.btns {
    text-align: center;
    padding-top: 15px;
    margin-bottom: 10px;
    > button {
      &:nth-child(1) {
        margin-right: 15px;
      }
      &:nth-child(2) {
        margin-left: 15px;
      }
    }
  }
  > ul.posts {
    background-color: white;
    /* border: 3px solid pink; */
    margin: 0;
    list-style: none;
    padding-left: 0;
    height: 100%;
    overflow: auto;
    padding: 1%;
    > li.post {
      border: 2px solid gray;
      padding: 1%;
      margin-bottom: 4%;
      display: flex;
      flex-direction: column;
      /* flex-wrap: auto; */
      > span.purchased-at {
        /* flex: 1; */
        margin-bottom: 1%;
      }
      > p {
        border-top: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
        box-shadow: 1px 1px 1px gray;
        margin: 0;
        width: 100%;
        padding: 1%;
        text-overflow: ellipsis;
        &.title {
          /* flex: 1; */
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
        &.content {
          /* flex: 4; */
          /* height: 5vh; */
          word-break: normal;
          /* white-space: normal; */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      > div.btn-price {
        /* flex: 1; */
        display: flex;
        justify-content: space-between;
        margin-top: 1%;
        > span {
          &.btn {
          }
          &.price {
            margin-right: 3%;
          }
        }
      }
    }
  }
`;

//타이틀 버튼 틀릭하면 해당 포스트로 이동
function Post({ post }) {
  //여기서 createdAt은 구매한 날짜임.
  const { id, title, content, targetPoint, nickname: writer, createdAt } = post;
  const day = (createdAt && createdAt.split(' ')[0]) || '2022-05-16 05:26:45';

  const handleClick = (e) => {
    e.preventDefault();
    //게시글 이동 창.
    window.open(`/main/search/${id}`, '_blank');
  };

  return (
    <li className="post">
      <span className="purchased-at">{day}</span>
      <p className="title" onClick={handleClick}>
        {title}
      </p>
      <div className="btn-price">
        <span className="writer">{writer}</span>
        <span className="price">{targetPoint} P</span>
      </div>
    </li>
  );
}

function PaidPosts() {
  const accToken = localStorage.getItem('act');
  const LIMIT = 10;
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [paidPostList, setPaidPostList] = useState([]);
  const offset = page * LIMIT - LIMIT;
  const totalPage = Math.ceil(totalCnt / LIMIT) || 1;

  const getConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${accToken}`,
      },
      withCredentials: true,
    }),
    [accToken],
  );

  const handlePage = useCallback(() => {
    if (paidPostList.length > offset) return;

    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/info/order?pages=${page}&limit=${LIMIT}`,
        getConfig,
      )
      .then((res) => {
        const { count, rows } = res.data.info;

        if (page === 1 && count) setTotalCnt(Number(count));
        if (rows && rows.length > 0)
          setPaidPostList([...paidPostList, ...rows]);
      })
      .catch((err) => err.response?.message && alert(err.response.message));
  }, [paidPostList, offset, page, getConfig]);

  useEffect(() => handlePage(), [handlePage, page]);

  return (
    <EntireContainer>
      <div className="btns">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          {'<<'}
        </button>
        {page} / {totalPage}
        <button disabled={page === totalPage} onClick={() => setPage(page + 1)}>
          {'>>'}
        </button>
      </div>
      <ul className="posts">
        {paidPostList.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </ul>
    </EntireContainer>
  );
}

export default PaidPosts;
