import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight, faCircleLeft } from '@fortawesome/free-solid-svg-icons';

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
      &.private {
        color: crimson;
      }
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
  font-family: '??????B';
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

function Post({ post }) {
  const { id, title, type, targetPoint, activate, createdAt, updatedAt } = post;

  const handleClick = () => {
    window.open(`/main/search/${id}`, '_blank');
  };

  return (
    <tr>
      <td scope="row" data-label="??????">
        {type === 'Free' ? '??????' : '??????'}
      </td>
      <td data-label="??????" className={activate ? '' : 'private'}>
        {activate ? '?????????' : '?????????'}
      </td>
      <td data-label="??????" className="title" onClick={handleClick}>
        {title}
      </td>
      <td data-label="??????">{targetPoint}</td>
      <td data-label="????????????">{createdAt}</td>
      <td data-label="????????????">{updatedAt}</td>
    </tr>
  );
}

function MyPosts() {
  //????????? ??????
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(null);
  const LIMIT = 6;
  const offset = page * LIMIT - LIMIT;
  const totalPage = Math.ceil(totalCnt / LIMIT) || 1;

  //????????? ?????????
  const [postList, setPostList] = useState([]);

  //axios ?????????
  const accToken = localStorage.getItem('act');
  const config = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //?????? ?????? ??????
  const prevBtnClick = (e) => {
    e.preventDefault();
    if (page === 1) return;
    setPage(page - 1);
  };
  //?????? ?????? ??????
  const nextBtnClick = (e) => {
    e.preventDefault();
    if (page === totalPage) return;
    setPage(page + 1);
  };

  //??? ?????????: ?????? ??? ????????? ????????????
  useEffect(() => {
    if (postList.length > offset) return;

    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/info?pages=${page}&limit=${LIMIT}`,
        config,
      )
      .then((res) => {
        const { rows, count } = res?.data?.info;
        if (rows && rows.length > 0) setPostList([...postList, ...rows]);
        if (count && page === 1) setTotalCnt(Number(count));
      })
      .catch((err) => err.response?.message && alert(err.response.message));
  }, [page]);

  return (
    <EntireContainer>
      {postList.length === 0 ? (
        <NoFound>????????? ???????????? ???????????? {':('}</NoFound>
      ) : (
        <Wrapper>
          <Table>
            <table>
              <colgroup>
                <col style={{ width: '5%' }} />
                <col style={{ width: '5%' }} />
                <col style={{ width: '43%' }} />
                <col style={{ width: '7%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>??????</th>
                  <th>??????</th>
                  <th>??????</th>
                  <th>??????</th>
                  <th>????????????</th>
                  <th>????????????</th>
                </tr>
              </thead>
              <tbody>
                {postList.slice(offset, offset + LIMIT).map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </tbody>
            </table>
          </Table>
          <div id="paging">
            <button disabled={Number(page) === 1} onClick={prevBtnClick}>
              <FontAwesomeIcon icon={faCircleLeft} />
            </button>
            <span>
              {page} / {totalPage}
            </span>
            <button
              onClick={nextBtnClick}
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

export default MyPosts;
