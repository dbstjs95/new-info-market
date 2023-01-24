import logo from '../images/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import UserMenu from './UserMenu';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  > hr {
    margin: 0;
    border: 0;
    height: 3px;
    background-image: -webkit-linear-gradient(left, #f0f0f0, #8c8c8c, #f0f0f0);
    background-image: -moz-linear-gradient(left, #f0f0f0, #8c8c8c, #f0f0f0);
    background-image: -ms-linear-gradient(left, #f0f0f0, #8c8c8c, #f0f0f0);
    background-image: -o-linear-gradient(left, #f0f0f0, #8c8c8c, #f0f0f0);
  }
  .header-navbar {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(255, 255, 255);
    padding: 25px 20px 20px;
    color: #333;
  }
  .header-logo {
    width: 200px;
    display: block;
  }
  .header-faBars {
    position: absolute;
    top: 30px;
    right: 30px;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    display: none;
    cursor: pointer;
  }
  .header-menu {
    display: flex;
    li {
      font-size: 1.2rem;
      padding: 5px 12px;
      transition: all 0.2s linear;
      border-radius: 3px;
      &:hover,
      &.active {
        background-color: lightgoldenrodyellow;
        box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
        transform: rotate(7deg);
        color: crimson;
      }
    }
  }
  .login-info {
    display: flex;
    li {
      padding: 5px 7px;
      transition: all 0.2s linear;
      a {
        color: inherit;
        font-size: 1.1rem;
      }
      &:hover {
        transform: scale(110%);
        color: crimson;
      }
    }
  }

  @media screen and (max-width: 1000px) {
    .header-navbar {
      flex-direction: column;
      padding-bottom: 30px;
      justify-content: center;
      align-items: flex-start;
    }
    .header-logo {
      width: 150px;
    }
    .header-faBars {
      display: flex;
    }
    .header-menu {
      border: 1px dotted gray;
      border-left: 0;
      border-right: 0;
      display: none;
      flex-direction: column;
      width: 100%;
      li {
        width: 100%;
        text-align: center;
        &:hover,
        &.active {
          transform: scale(105%);
        }
      }
      &.open {
        display: block;
        margin: 20px 0;
      }
    }
    .login-info {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: -10px;
      @media screen and (max-width: 480px) {
        margin-top: 15px;
        li a {
          font-size: 0.8rem;
        }
      }
    }
  }

  @media screen and (max-width: 600px) {
    .header-menu li {
      font-size: 1rem;
    }
    .login-info li a {
      font-size: 1rem;
    }
  }
`;

function Header() {
  const { pathname } = useLocation();
  /* 반응형 상태에서 icon 누를시 메뉴 보이고, 일반적으론 안보이게하기 */
  const [isOpen, setIsOpen] = useState(false);

  const handleBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer>
      <nav className="header-navbar">
        <span onClick={handleBar} className="header-faBars">
          <FontAwesomeIcon icon={faBars} />
        </span>
        <Link to="/">
          <img src={logo} alt="logo " className="header-logo" />
        </Link>
        <ul className={isOpen ? 'header-menu open' : 'header-menu'}>
          <Link to="/main">
            <li className={pathname === '/main' ? 'active' : ''}>메인페이지</li>
          </Link>
          <Link to="/freeboard">
            <li className={pathname === '/freeboard' ? 'active' : ''}>
              무료 정보 게시판
            </li>
          </Link>
          <Link to="/paidboard">
            <li className={pathname === '/paidboard' ? 'active' : ''}>
              유료 정보 게시판
            </li>
          </Link>
        </ul>
        <ul className="login-info">
          <UserMenu />
        </ul>
      </nav>
      <hr />
    </HeaderContainer>
  );
}
export default Header;
