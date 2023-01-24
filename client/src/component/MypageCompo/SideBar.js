import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';

const EntireContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    width: 70%;
    @media screen and (max-width: 1100px) {
      min-width: 90%;
    }
    @media screen and (max-width: 900px) {
      min-width: 100%;
    }
    height: 100%;
    /* border: 3px solid black; */
    > section {
      /* border: 4px solid green; */
      /* border-radius: 0 7px 7px 0; */
      flex: 1 0 20%;
      display: flex;
      flex-direction: column;
      /* min-width: 20%; */
      padding: 1%;
      background-color: orange;
      > .nav-link {
        font-weight: bold;
        text-align: center;
        padding: 3% 1%;
        border-radius: 5px;
        color: white;
        text-decoration: none;
        margin-bottom: 10%;
        &:hover {
          background-color: white;
          color: #ff5733;
        }
      }
      > .activated {
        background-color: white;
        color: #ff5733;
      }
    }

    > div.userInfo {
      background-color: orange;
      border-top-right-radius: 5px;
      min-width: 80%;
      /* padding: 2%; */
      flex: 1 1 80%;
      display: flex;
      flex-direction: column;
    }
  }
`;

const SideBar = () => {
  const { grade } = useSelector(selectUserInfo);

  const linkList = [
    ['회원 정보 수정', '/mypage/info/change', 'faGear'],
    ['내 글 보기', '/mypage/info/myposts', ''],
    ['구매 내역', '/mypage/info/paidPosts', ''],
    ['포인트 충전 내역', '/mypage/info/chargedPointList', ''],
    ['환불 내역', '/mypage/info/refundList', ''],
    ['무료글 작성', '/mypage/freeWriting', ''],
  ];

  const [Links, setLinks] = useState(linkList);

  //아래 Bronze는 나중에 빼기
  useEffect(() => {
    if (['Bronze', 'Silver', 'Gold'].includes(grade)) {
      setLinks((prev) => [
        ...prev,
        ['유료글 작성', '/mypage/salesWriting', ''],
      ]);
    }
  }, []);

  return (
    <EntireContainer>
      <div>
        <section>
          {Links.map(([item, link, icon], idx) => (
            <NavLink
              key={idx}
              style={{ whiteSpace: 'nowrap' }}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' activated' : '')
              }
              to={link}
            >
              {item} {icon ? <FontAwesomeIcon icon={faGear} /> : ''}
            </NavLink>
          ))}
        </section>
        <div className="userInfo">
          <Outlet />
        </div>
      </div>
    </EntireContainer>
  );
};

export default SideBar;
