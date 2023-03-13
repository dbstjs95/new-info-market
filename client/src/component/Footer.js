import React from 'react';
import styled from 'styled-components';
import logo from '../images/logo.png';

const FooterContainer = styled.footer`
  background-color: gray;
  padding: 1rem;
  color: white;
  width: 100%;
  min-height: 200px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, auto));
  gap: 1rem;
  overflow: hidden;
`;

const LinksContainer = styled.div`
  padding-left: 1rem;
  border-left: 1px solid white;
  p {
    font-weight: bold;
    display: flex;
  }
  ul {
    display: flex;
    gap: 2rem;
  }
  a:hover {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: darkgray;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <ContentContainer>
        <LinksContainer>
          <img src={logo} height="50px" />
          <p>Copyright © 2022 Info-Market</p>
        </LinksContainer>
        <LinksContainer>
          <p>About Info-Market</p>
          <ul>
            <li>
              <a
                href="https://github.com/codestates/info-market"
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                Repository
              </a>
            </li>
            <li>
              <a
                href="https://github.com/codestates/info-market/wiki"
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                Wiki
              </a>
            </li>
          </ul>
        </LinksContainer>
        <LinksContainer>
          <p>Contact</p>
          <ul>
            <li>
              <a
                href="https://github.com/tkdals0905"
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                오상민
              </a>
            </li>
            <li>
              <a
                href="https://github.com/wlgns1501"
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                유지훈
              </a>
            </li>
            <li>
              <a
                href="https://github.com/dbstjs95"
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                최윤선
              </a>
            </li>
            <li>
              <a
                href="https://github.com/goni1621"
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
                {' '}
                박제곤
              </a>
            </li>
          </ul>
        </LinksContainer>
      </ContentContainer>
    </FooterContainer>
  );
}

export default Footer;
// import React from 'react';
// import styled from 'styled-components';

// const FooterContainer = styled.div`
//   text-align: center;
//   background: #343a40;
//   color: white;
//   align-items: center;
//   padding: 20px 20px;
//   > ul {
//     list-style: none;
//   }
// `;

// const Footer = () => {
//   const thisYear = () => {
//     const year = new Date().getFullYear();
//     return year;
//   };

//   return (
//     <FooterContainer className="footer">
//       <p>
//         Copyright &copy; <span>{thisYear()}</span>
//       </p>
//       <ul className="footer-info">
//         <li>Back-End&nbsp;:&nbsp;오상민</li>
//         <li>Back-End&nbsp;:&nbsp;유지훈</li>
//         <li>Front-End&nbsp;:&nbsp;최윤선</li>
//         <li>Front-End&nbsp;:&nbsp;박제곤</li>
//       </ul>
//     </FooterContainer>
//   );
// };

// export default Footer;
