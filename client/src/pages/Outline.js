import { Outlet } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import styled, { css } from 'styled-components';
import GlobalFonts from '../fonts/fonts';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();

  const isFull = (path) => {
    const full_path = ['/', '/login', '/tos', '/signup', '/main/search'];
    return full_path.includes(path) || path.includes('/main/search/');
  };

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
