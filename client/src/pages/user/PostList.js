import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import Search from '../../component/Search';
import Pagination from '../../component/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import { updateSearch, selectSearch } from '../../store/slices/search';
import { clearPostState } from '../../store/slices/selectedPost';
import { useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faEye, faUser } from '@fortawesome/free-solid-svg-icons';
import 전구 from '../../images/bulb.png';

const EntireContainer = styled.div`
  background-color: rgba(250, 249, 210, 0.4);
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const CommonStyle = css`
  width: 15%;
  @media screen and (max-width: 800px) {
    display: none;
  }
`;
const LeftSide = styled.div`
  ${CommonStyle}
`;
const RightSide = styled.div`
  ${CommonStyle}
`;

const Background = styled.div`
  background-image: url(${전구});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 60%;
  &.left {
  }
  &.right {
  }
`;

const CenterBox = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 20px;
  }
  > div.bar {
    width: 800px;
    border-radius: 10px;
    box-shadow: 0 5px 2px rgba(0, 0, 0, 0.2);
    background-color: #f2bd24;
    > form {
      border: 0;
      padding: 10px 5px;
      > select {
        border: 0;
      }
      > span#search-icon {
        color: white;
      }
    }
    @media screen and (max-width: 1220px) {
      width: 100%;
    }
  }
  > ul.paging {
    width: 100%;
  }
`;

const UlContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
  min-height: 80vh;
  margin: 30px 0;
  @media screen and (max-width: 1220px) {
    width: 100%;
  }
`;

const PostContainer = styled.li`
  border-top: 1px solid gray;
  border-bottom: 1px solid gray;
  width: 100%;
  padding: 2% 3%;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgb(32 33 36 / 28%);
  &:not(:last-child) {
    margin-bottom: 2%;
  }
  > div.writer_createdAt {
    display: flex;
    justify-content: space-between;
  }
  > p.title {
    border: 1px solid lightgray;
    height: 50px;
    display: flex;
    align-items: center;
    margin: 10px 0;
    padding-left: 5px;
    box-shadow: -2px 3px 2px lightgray;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > div.total_Likes_Views {
    display: flex;
    justify-content: space-between;
  }
`;

const Price = styled.span`
  margin-right: 20px;
  border: 3px solid #c4ac21;
  border-radius: 5px;
  padding: 2px;
  font-weight: bolder;
  color: white;
  background-color: #c4ac21;
`;

function Post({ post }) {
  const navigate = useNavigate();
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
    type,
  } = post;

  const day = createdAt.split('T')[0];

  //type으로 유료, 무료 구분해서 디자인하기
  return (
    <PostContainer>
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
          {type === 'Paid' && <Price>{targetPoint} P</Price>}
          <FontAwesomeIcon icon={faEye} /> {totalViews}
        </span>
      </div>
    </PostContainer>
  );
}

function PostList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { search_type, info_type, input_value } = QueryString.parse(
    location.search,
    {
      ignoreQueryPrefix: true,
    },
  );

  const accToken = localStorage.getItem('act');
  const { page, list } = useSelector(selectSearch);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const LIMIT = 8;
  const offset = page * LIMIT - LIMIT;

  const [msg, setMsg] = useState('');

  useEffect(() => {
    dispatch(clearPostState());
    setMsg('');
    const select1 = search_type || 'title';
    const select2 = info_type || 'All';

    const params = {
      search_type: select1,
      info_type: select2,
      pages: page,
      limit: LIMIT,
      [select1]: input_value,
    };

    axios
      .get(`${process.env.REACT_APP_SERVER_DEV_URL}/search`, {
        params,
        ...getConfig,
      })
      .then((res) => {
        const { count, rows } = res.data.info;
        if (count && page === 1) {
          const totalPage = Math.ceil(Number(count) / LIMIT);
          const totalMark = Math.ceil(totalPage / 10);

          dispatch(
            updateSearch({
              totalCount: count,
              totalPage,
              totalMark,
            }),
          );
        }
        if (rows) dispatch(updateSearch({ list: [...rows] }));
      })
      .catch((err) => {
        let { message } = err.response.data;
        if (message) setMsg(message);
      });
  }, [page, search_type, info_type, input_value]);

  return (
    <EntireContainer>
      <LeftSide>
        <Background className="left" />
      </LeftSide>
      <CenterBox>
        <Search />
        <UlContainer className="postList">
          {list.map((post) => {
            return <Post key={post.id} post={post} />;
          })}
          {list.length === 0 && <li>{msg}</li>}
        </UlContainer>
        <Pagination />
      </CenterBox>
      <RightSide>
        <Background className="right" />
      </RightSide>
    </EntireContainer>
  );
}

export default PostList;
