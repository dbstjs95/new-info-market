import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { clearState, selectUserInfo } from '../store/slices/userInfo';
import axios from 'axios';

const EntireContainer = styled.ul`
  /* border: 1px solid black;
  li {
    border: 1px solid red;
  } */
  /* position: relative;
  > ul.login-signup-btn {
    display: inline-flex;
    > li.login-btn {
      margin-right: 15px;
    }
  }
  > ul.popup {
    z-index: 1000;
    background-color: #fff;
    position: absolute;
    top: calc(100% + 25px);
    right: -10px;
    border: 1px solid #ebebeb;
    box-shadow: var(--box-shadow);
    border-radius: 5px 0 5px 5px;
    overflow: hidden;
    > li {
      padding: 15px 19px;
      font-family: var(--noto-sans);
      white-space: nowrap;
      &:hover {
        background-color: #f4f4f4;
        cursor: pointer;
      }
    }
  } */
`;

const IconContainer = styled.div`
  position: relative;
  padding-right: 10px;
  font-size: 1.3rem;
  @media screen and (max-width: 1000px) {
    font-size: 1.1rem;
    padding-right: 5px;
    width: 100%;
    text-align: right;
  }
  @media screen and (max-width: 600px) {
    font-size: 1rem;
  }
`;

const Popup = styled.ul`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  text-align: center;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  li {
    border: 1px dotted lightgray;
    padding: 10px 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.1rem;
    color: #444;
    cursor: pointer;
    @media screen and (max-width: 600px) {
      font-size: 1rem;
    }
  }
`;

function UserMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { isLogin, accToken, grade } = useSelector(selectUserInfo);
  const config = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    setIsOpen((nextIsOpen) => !nextIsOpen);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogOut = () => {
    axios
      .post(`${process.env.REACT_APP_SERVER_DEV_URL}/auth/logout`, null, config)
      .then((res) => {
        dispatch(clearState());
        navigate('/main');
      })
      .catch((err) => alert(err.response.message));
  };

  return (
    // <EntireContainer className="userMenu">
    <>
      {isLogin ? (
        <IconContainer>
          <FontAwesomeIcon
            icon={faCircleUser}
            size="2x"
            onClick={handleButtonClick}
          />
          {isOpen && (
            <Popup>
              <li className="logout-btn" onClick={handleLogOut}>
                로그아웃
              </li>
              <li
                className="mypage-btn"
                onClick={() => navigate(`/mypage/info/change`)}
              >
                {/* <Link
                  to="/mypage/info/change"
                  style={{ textDecoration: 'none' }}
                > */}
                마이페이지
                {/* </Link> */}
              </li>
              <li onClick={() => navigate(`/mypage/freeWriting`)}>
                무료글 작성
              </li>
              <li onClick={() => navigate(`/mypage/salesWriting`)}>
                유료글 작성
              </li>
            </Popup>
          )}
        </IconContainer>
      ) : (
        <>
          <li className="login-btn">
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
              }}
            >
              로그인
            </Link>
          </li>
          <li className="signup-btn">
            <Link
              to="/tos"
              style={{
                textDecoration: 'none',
              }}
            >
              회원가입
            </Link>
          </li>
        </>
      )}
    </>
  );
}

export default UserMenu;
