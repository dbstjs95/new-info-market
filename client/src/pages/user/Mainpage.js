import React, { useState, useEffect } from 'react';
import Search from '../../component/Search';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { clearPostState } from '../../store/slices/selectedPost';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import gold from '../../images/gold.png';
import second from '../../images/second.png';
import third from '../../images/third.png';
import main from '../../images/main.jpeg';
import bulb from '../../images/bulb.jpeg';

const EntireContainer = styled.div`
  display: flex;
  justify-content: space-between;
  > div.main {
    width: 45%;
    background-image: url(${main});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
    @media screen and (max-width: 1100px) {
      display: none;
    }
  }
  > div#best_list {
    width: 55%;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 1100px) {
      width: 100%;
    }
  }
  div.bar {
    height: 80px;
  }
`;

const UlContainer = styled.ul`
  border: 12px solid rgba(0, 0, 0, 0.1);
  height: 600px;
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: white;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 0 10px 10px;

  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
  }
  > li {
    background-color: whitesmoke;
    width: 90%;
    height: 60px;
    padding: 10px;
    margin-bottom: 15px;
    &#top10_title {
      padding: 5px;
      margin-top: 5px;
      font-size: 1.5rem;
      font-weight: bolder;
      background-color: white;
      color: #403d3d;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2rem;
        color: #09429e;
        margin-left: 10px;
        border-bottom: 5px dashed #c90e2a;
        padding: 2px 2px 0;
      }
      @media screen and (max-width: 600px) {
        font-size: 1.3rem;
        padding: 2px 0 0;
        span {
          border-bottom: 4px dashed #c90e2a;
        }
      }
      @media screen and (max-width: 480px) {
        justify-content: center;
      }
    }

    &.top10_post {
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 5px 7px 3px lightgray;
      font-weight: bold;
      font-size: 1.1rem;
      > p.head {
        display: flex;
        align-items: center;
        width: 90%;
        > img {
          width: 30px;
          height: 30px;
        }
        > span.title {
          margin-left: 10px;
          cursor: pointer;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      > p.writer {
        height: 100%;
        font-size: 1rem;
        color: #cc6702;
        display: flex;
        justify-content: center;
        align-items: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        @media screen and (max-width: 380px) {
          display: none;
        }
      }
      @media screen and (max-width: 600px) {
        font-size: 1rem;
        > p.writer {
          font-size: 0.9rem;
        }
      }
      @media screen and (max-width: 480px) {
        font-size: 0.9rem;
      }
    }
  }
  div img#ad {
    height: 200px;
    object-fit: cover;
    margin-top: 20px;
  }
`;

function Post({ post, order }) {
  const navigate = useNavigate();
  const { id: postId, title, nickname, userId } = post;

  const handleClick = () => {
    navigate(`/main/search/${postId}`);
  };

  return (
    <li className="top10_post">
      <p className="head">
        {order === 1 && <img src={gold} />}
        {order === 2 && <img src={second} />}
        {order === 3 && <img src={third} />}
        <span className="title" onClick={handleClick}>
          {title}
        </span>
      </p>
      <p className="writer">{nickname}</p>
    </li>
  );
}

function List({ posts }) {
  return (
    <UlContainer>
      <li id="top10_title">
        Best Info <span>TOP 10</span>
      </li>
      {posts.map((post, idx) => (
        <Post key={post.id} post={post} order={idx + 1} />
      ))}
      <div>
        <img id="ad" src={bulb} />
      </div>
    </UlContainer>
  );
}

function Mainpage() {
  const dispatch = useDispatch();
  const accToken = localStorage.getItem('act');
  const [list, setList] = useState([]);

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  useEffect(() => {
    dispatch(clearPostState());
    //인기 top 10개
    const infoURL = `${process.env.REACT_APP_SERVER_DEV_URL}/info`;
    axios
      .get(infoURL, getConfig)
      .then((res) => {
        const { info } = res.data;
        setList([...list, ...info]);
      })
      .catch((err) => {
        if (err.response?.message) alert(err.response.message);
      });
  }, []);

  return (
    <EntireContainer>
      <div className="main" />
      <div id="best_list">
        <Search />
        <List posts={list} />
      </div>
    </EntireContainer>
  );
}

export default Mainpage;
