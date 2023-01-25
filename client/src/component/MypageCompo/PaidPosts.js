import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const EntireContainer = styled.div`
  * {
    /* border: 1px solid red; */
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 50vh;
  padding: 10px;
  > div#paging {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20%;
    min-width: 150px;
    color: #821e9c;
    font-weight: bold;
    font-size: 1.1rem;
    > button {
      cursor: pointer;
      background: transparent;
      border: 0;
      color: #821e9c;
      font-size: 1.3rem;
      &:disabled {
        opacity: 0;
      }
    }
  }
`;

const Table = styled.div`
  width: 100%;
  position: relative;
  margin: 25px auto;
  border-top: 2px solid #777;
  > table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    thead tr th {
      border-bottom: 1px solid #888;
      color: #71038c;
    }
    tbody tr td {
      border-bottom: 1px solid #efefef;
      &.title {
        word-break: break-all;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    thead tr th,
    tbody tr td {
      text-align: left;
      padding: 10px;
      font-size: 15px;
      line-height: 0.9rem;

      /* desktop only */
      @media screen and (min-width: 991px) {
        padding: 12px 20px;
        font-size: 1rem;
        line-height: 22px;
      }
    }

    /* mobile only */
    @media screen and (max-width: 680px) {
      col {
        width: 100% !important;
      }
      thead {
        display: none;
      }
      tbody tr {
        border-bottom: 1px solid #efefef;
        td {
          width: 100%;
          display: flex;
          margin-bottom: 2px;
          padding: 5px;
          border-bottom: none;
          font-size: 14px;
          line-height: 18px;
          &:first-child {
            padding-top: 16px;
          }
          &:last-child {
            padding-bottom: 15px;
          }
          &::before {
            /* display: inline-block; */
            margin-right: 12px;
            -webkit-box-flex: 0;
            -ms-flex: 0 0 100px;
            flex: 0 0 100px;
            font-weight: 700;
            content: attr(data-label);
          }
        }
      }
    }
  }
`;

const NoFound = styled.div`
  font-family: '순천B';
  font-size: 20px;
  color: gray;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px dotted lightgray;
  word-break: break-all;
  @media screen and (max-width: 480px) {
    font-size: 17px;
  }
`;

//타이틀 버튼 틀릭하면 해당 포스트로 이동
function Post({ post }) {
  //여기서 createdAt은 구매한 날짜임.
  const { id, title, targetPoint, nickname: writer, createdAt } = post;

  const handleClick = (e) => {
    e.preventDefault();
    //게시글 이동 창.
    window.open(`/main/search/${id}`, '_blank');
  };

  return (
    <tr>
      <td scope="row" data-label="자료번호">
        {id}
      </td>
      <td scope="row" data-label="구매일">
        {createdAt}
      </td>
      <td data-label="제목" className="title" onClick={handleClick}>
        {title}
      </td>
      <td data-label="작성자">{writer}</td>
      <td data-label="가격">{targetPoint}</td>
    </tr>
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
      {paidPostList?.length === 0 ? (
        <NoFound>구매한 자료가 없습니다 {':('}</NoFound>
      ) : (
        <Wrapper>
          <Table>
            <table>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '50%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>자료번호</th>
                  <th>구매일</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                {paidPostList?.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </tbody>
            </table>
          </Table>
          <div id="paging">
            <button
              disabled={Number(page) === 1}
              onClick={() => setPage(page - 1)}
            >
              <FontAwesomeIcon icon={faCircleLeft} />
            </button>
            <span>
              {page} / {totalPage}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={Number(page) === Number(totalPage)}
            >
              <FontAwesomeIcon icon={faCircleRight} />
            </button>
          </div>
        </Wrapper>
      )}
    </EntireContainer>
  );
}

export default PaidPosts;
