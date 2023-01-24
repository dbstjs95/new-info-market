import { useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styled, { css } from 'styled-components';
import GlobalFonts from '../fonts/fonts';
import { useLocation } from 'react-router-dom';
import {
  selectUserInfo,
  updateState,
  clearState,
} from '../store/slices/userInfo';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const EntireContainer = styled.div`
  * {
    font-family: 'Elice Bold';
    font-family: '순천B';
  }
`;

const BodyContainer = styled.div`
  * {
    font-family: 'Elice Regular';
    font-family: '다이어리';
    font-family: '순천R';
  }
  /* border: 2px solid red; */
  min-height: 70vh;
  ${({ full }) =>
    full
      ? css`
          /* width: 100vw; */
        `
      : css`
          width: 85vw;
          margin: 30px auto;
          @media screen and (max-width: 1200px) {
            width: 90vw;
          }
          @media screen and (max-width: 800px) {
            width: 95vw;
          }
          @media screen and (max-width: 480px) {
            width: 100vw;
          }
        `}
`;

function Outline() {
  const dispatch = useDispatch();
  const { isLogin, accToken } = useSelector(selectUserInfo);
  const { pathname } = useLocation();

  const isFull = (path) => {
    const full_path = ['/', '/login', '/tos', '/signup', '/main/search'];
    return full_path.includes(path) || path.includes('/main/search/');
  };

  const handleAuth = useCallback(() => {
    let token = window.localStorage.getItem('act');
    if (!token) return;
    const url = `${process.env.REACT_APP_SERVER_DEV_URL}/auth`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          IsAuthCheck: true,
        },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          dispatch(
            updateState({
              ...res.data,
              isLogin: true,
            }),
          );
        }
      })
      .catch((err) => {
        window.localStorage.removeItem('token');
        dispatch(clearState());
        const { message } = err.response.data;
        if (message) alert(message);
      });
  }, [updateState, clearState]);

  useEffect(() => {
    if (!isLogin) handleAuth();
  });

  return (
    <>
      <GlobalFonts />
      <EntireContainer>
        <Header />
        <BodyContainer id="content-wrap" full={isFull(pathname)}>
          <Outlet />
        </BodyContainer>
        <Footer />
      </EntireContainer>
    </>
  );
}

export default Outline;
