import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import axios from 'axios';

const EntireContainer = styled.div`
  border-left: 5px solid orange;
  border-right: 3px solid orange;
  background-color: white;
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PostContainer = styled.tr`
  border: 3px solid lightgray;
  > td {
    vertical-align: middle;
    padding: 5px;
    border: 3px solid lightgray;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.title {
      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
    &.createdAt,
    &.updatedAt {
      white-space: normal;
      text-overflow: clip;
    }
  }
`;

const NoFound = styled.div`
  font-family: '순천B';
  font-size: 30px;
  color: gray;
`;

const Wrapper = styled.div`
  /* border: 3px solid red; */
  height: 100%;
  > table {
    width: 100%;
    height: 70%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    text-align: center;
    > thead {
      background-color: lightgray;
      margin-bottom: 10px;
      font-size: 1rem;
      padding: 10px;
    }
  }
  > div#paging {
    /* border: 1px dotted red; */
    padding: 2%;
    display: flex;
    justify-content: space-between;
    margin: 8px 5px 5px 0;
    > button {
      cursor: pointer;
    }
  }
`;

function Post({ post }) {
  const {
    id,
    title,
    type,
    targetPoint,
    totalViews,
    totalLikes,
    activate,
    createdAt,
    updatedAt,
  } = post;

  const handleClick = (e) => {
    e.preventDefault();
    //게시글 이동 창.
    window.open(`/main/search/${id}`, '_blank');
  };

  return (
    <PostContainer>
      <td className="id">{id}</td>
      <td className="type">{type === 'Free' ? '무료' : '유료'}</td>
      <td className="type">{activate || '대기중'}</td>
      <td onClick={handleClick} className="title">
        {title}
      </td>
      <td className="like">{totalLikes}</td>
      <td className="point">{targetPoint}</td>
      <td className="createdAt">{createdAt}</td>
      <td className="updatedAt">{updatedAt}</td>
    </PostContainer>
  );
}

function MyPosts() {
  const dispatch = useDispatch();

  //페이징 변수
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(null);
  const LIMIT = 6;
  const offset = page * LIMIT - LIMIT;
  const totalPage = Math.ceil(totalCnt / LIMIT) || 1;

  //게시글 리스트
  const [postList, setPostList] = useState([]);

  //axios 헤더용
  const { accToken } = useSelector(selectUserInfo);
  const config = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //이전 버튼 클릭
  const prevBtnClick = (e) => {
    e.preventDefault();
    if (page === 1) return;
    setPage(page - 1);
  };
  //다음 버튼 클릭
  const nextBtnClick = (e) => {
    e.preventDefault();
    if (page === totalPage) return;
    setPage(page + 1);
  };

  //첫 렌더링: 내가 쓴 게시글 받아오기
  useEffect(() => {
    if (postList.length > offset) return;

    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/info?pages=${page}&limit=${LIMIT}`,
        config,
      )
      .then((res) => {
        const { rows, count } = res.data.info;
        console.log(rows);
        if (rows && rows.length > 0) setPostList([...postList, ...rows]);
        if (count && page === 1) setTotalCnt(Number(count));
      })
      .catch((err) => err.response?.message && alert(err.response.message));
  }, [page]);

  return (
    <EntireContainer>
      {postList.length === 0 ? (
        <NoFound>작성한 게시물이 없습니다!</NoFound>
      ) : (
        <Wrapper>
          <div id="paging">
            <button disabled={Number(page) === 1} onClick={prevBtnClick}>
              이전
            </button>
            <span>
              {page} / {totalPage}
            </span>
            <button
              onClick={nextBtnClick}
              disabled={Number(page) === Number(totalPage)}
            >
              다음
            </button>
          </div>
          <table>
            <colgroup>
              <col id="id" width="5%" />
              <col id="type" min-width="5%" />
              <col id="active" min-width="7%" />
              <col id="title" width="30%" />
              <col id="like" min-width="7%" />
              <col id="point" min-width="7%" />
              <col id="createdAt" width="13%" />
              <col id="updatedAt" width="13%" />
            </colgroup>
            <thead>
              <tr>
                <th style={{ padding: '8px' }}>번호</th>
                <th>종류</th>
                <th>상태</th>
                <th>제목</th>
                <th>추천수</th>
                <th>가격</th>
                <th>작성일자</th>
                <th>수정일자</th>
              </tr>
            </thead>
            <tbody>
              {postList.slice(offset, offset + LIMIT).map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </Wrapper>
      )}
    </EntireContainer>
  );
}

export default MyPosts;
