import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faXmark, faBars } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';

const EntireContainer = styled.div`
  position: relative;
  /* border: 2px solid blue; */
  overflow-x: hidden;
  > section {
    position: absolute;
    left: 0;
    top: 0;
    transition: transform 0.5s cubic-bezier(0, 0.52, 0, 1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    width: 180px;
    background-color: #ac19bf;
    &.show {
      transform: translate3d(0%, 0, 0);
    }
    &.hide {
      transform: translate3d(-105%, 0, 0);
    }
    > span {
      position: absolute;
      top: 5px;
      left: 105%;
      display: flex;
      align-items: center;
      color: #ac19bf;
      font-size: 1.2rem;
      padding: 10px;
      cursor: pointer;
      z-index: 1000;
      &.open {
        background-color: white;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        &:hover {
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.1);
        }
      }
    }
    > a {
      font-weight: bold;
      text-align: center;
      padding: 20px 10px;
      color: white;
      border-bottom: 1px solid #f4b8fc;
      transition: all 0.2s linear;
      &.activated {
        background-color: #f4dcf7;
        color: #ac19bf;
      }
      &:not(.activated):hover {
        padding: 25px 10px;
        box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3);
      }
    }
  }
  > div.userInfo {
    width: 80%;
    margin: 0 auto;
    @media screen and (max-width: 1100px) {
      width: 90%;
    }
    @media screen and (max-width: 800px) {
      width: 100%;
    }
  }
`;

const SideBar = () => {
  const { grade } = useSelector(selectUserInfo);

  const linkList = [
    ['?????? ?????? ??????', '/mypage/info/change', 'faGear'],
    ['??? ??? ??????', '/mypage/info/myposts', ''],
    ['?????? ??????', '/mypage/info/paidPosts', ''],
    ['????????? ?????? ??????', '/mypage/info/chargedPointList', ''],
    ['?????? ??????', '/mypage/info/refundList', ''],
    ['????????? ??????', '/mypage/freeWriting', ''],
    ['????????? ??????', '/mypage/salesWriting', ''],
  ];

  const [MenuOpen, setMenuOpen] = useState(false);

  const handleSideBar = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <EntireContainer>
      <section className={MenuOpen ? 'show' : 'hide'}>
        <span onClick={handleSideBar} className={MenuOpen ? '' : 'open'}>
          <FontAwesomeIcon icon={MenuOpen ? faXmark : faBars} />
        </span>
        {linkList.map(([item, link, icon], idx) => {
          let lastIdx = linkList.length - 1;
          if (!['Bronze', 'Silver', 'Gold'].includes(grade) && idx === lastIdx)
            return;
          return (
            <NavLink
              key={idx}
              style={{ whiteSpace: 'nowrap' }}
              className={({ isActive }) => (isActive ? ' activated' : '')}
              to={link}
            >
              {item} {icon ? <FontAwesomeIcon icon={faGear} /> : ''}
            </NavLink>
          );
        })}
      </section>
      <div className="userInfo">
        <Outlet />
      </div>
    </EntireContainer>
  );
};

export default SideBar;
