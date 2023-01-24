import React from 'react';
import Img2 from '../../images/img2.png';
import Img3 from '../../images/img3.jpg';
import '../../css/Home.css';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import homeLast from '../../images/homeLast.jpeg';

const EntireContainer = styled.div`
  * {
    font-family: 'Elice Bold';
    font-family: '순천B';
  }
`;

const IntroContainer = styled.div`
  height: 100vh;
  background: linear-gradient(-45deg, #fff, #c2c8c6, #5b8191, #7b7886);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  display: flex;
  align-items: center;
  align-content: center;
  > div.floater {
    flex: 1 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #3d261a;
    > div.title {
      flex: 1 0 auto;
      font-size: 3em;
      font-weight: bold;
      margin-bottom: 0.25em;
    }
    > div.desc {
      inline-size: 13em;
      flex: 1 0 auto;
      font-size: 2em;
      max-width: 60vw;
      margin-bottom: 1em;
    }
    > div.action {
      flex: 1 0 auto;
      > button {
        font-size: 1.4em;
        padding: 0.8em 1em;
        border-radius: 2em;
        border-style: hidden;
        background-color: rgba(255, 255, 255, 0.4);
        cursor: pointer;
      }
      > button:hover {
        font-weight: bold;
        background-color: rgba(255, 255, 255, 0.6);
      }
    }

    @media screen and (max-width: 600px) {
      > div.title {
        font-size: 2.5em;
      }
      > div.desc {
        font-size: 1.7em;
      }
      > div.action > button {
        font-size: 1.2em;
      }
    }
    @media screen and (max-width: 500px) {
      > div.title {
        font-size: 2.3em;
      }
      > div.desc {
        font-size: 1.4em;
      }
      > div.action > button {
        font-size: 1em;
      }
    }
    @media screen and (max-width: 380px) {
      > div.title {
        font-size: 2em;
      }
      > div.desc {
        font-size: 1.2em;
      }
    }
  }
`;

const FeatureContainer = styled.div`
  padding: 10rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background-color: #f3f5f7;
  border-bottom: solid lightgrey 1px;
  gap: 2rem;
  > img {
    min-width: 500px;
    width: 40%;
    border: solid lightgrey 1px;
    border-radius: 8px;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
    @media screen and (max-width: 600px) {
      min-width: 400px;
    }
    @media screen and (max-width: 480px) {
      min-width: 80%;
    }
    @media screen and (max-width: 400px) {
      min-width: 90%;
    }
  }
  > div.section {
    max-width: 500px;
    max-height: 300px;
    word-break: keep-all;
    div.heading {
      color: #4e453c;
      font-size: 3rem;
      font-weight: 700;
      inline-size: 10em;
      line-height: 1.5em;
    }
    div.sub {
      margin: 0.3em 0;
      color: #7f5a34;
      font-size: 1.5em;
      inline-size: 20em;
      line-height: 1.5em;
    }
    @media screen and (max-width: 600px) {
      div.heading {
        font-size: 2rem;
      }
      div.sub {
        font-size: 1.3rem;
      }
    }
    @media screen and (max-width: 500px) {
      div.heading {
        font-size: 1.8rem;
      }
      div.sub {
        font-size: 1.2rem;
      }
    }
    @media screen and (max-width: 450px) {
      div.heading {
        font-size: 1.6rem;
      }
      div.sub {
        font-size: 1.1rem;
      }
    }
    @media screen and (max-width: 380px) {
      padding: 5px;
      div.heading {
        font-size: 1.3rem;
      }
      div.sub {
        font-size: 0.9rem;
      }
    }
  }
`;

const FeatureContainer2 = styled(FeatureContainer)`
  background-color: white;
`;

const OutroContainer = styled(IntroContainer)`
  height: 40vh;
  > div.floater {
    > div.title {
      font-size: 2em;
    }
    > div.action {
      > button:first-of-type {
        margin-right: 1.2em;
      }
      @media screen and (max-width: 400px) {
        display: flex;
        flex-direction: column;
        > button:first-of-type {
          margin-right: 0;
          margin-bottom: 1em;
        }
      }
    }
  }
`;

function Home() {
  const navigate = useNavigate();

  const handleNonMember = () => {
    navigate(`/main`);
  };
  const handleLogin = () => {
    navigate(`/login`);
  };

  return (
    <EntireContainer>
      <IntroContainer>
        <div className="floater">
          <div className="title">Infomation</div>
          <div className="desc">
            당신이 필요한 정보는, 우리 Info-Market 에 있습니다.
          </div>
          <div className="action">
            <button onClick={handleNonMember}>비회원으로 이용하기</button>
          </div>
        </div>
      </IntroContainer>
      <FeatureContainer>
        <img src={Img2} />
        <div className="section">
          <div className="heading">나만 알기 아쉬운 정보가 있나요?</div>
          <div className="sub">정보는 재산입니다.</div>
          <div className="sub">당신의 정보를, 이곳에서 판매해보세요!</div>
        </div>
      </FeatureContainer>
      <FeatureContainer2>
        <div className="section">
          <div className="heading">무엇을 찾고 계신가요?</div>
          <div className="sub">우리 Info-Market 에서</div>
          <div className="sub">당신이 원하는 정보를 제공해 드릴게요</div>
        </div>
        <img src={Img3} />
      </FeatureContainer2>
      <FeatureContainer>
        <img src={homeLast} />
        <div className="section">
          <div className="heading">알고만 있는 정보, 아깝지 않으세요?</div>
          <div className="sub">유용한 정보를 판매하고,</div>
          <div className="sub">당신이 찾던 정보를 얻어가세요 !</div>
          <div className="sub">Info-Market 입니다</div>
        </div>
      </FeatureContainer>
      <OutroContainer>
        <div className="floater">
          <div className="action">
            <button onClick={handleNonMember}>비회원으로 이용하기</button>
            <button onClick={handleLogin}>로그인하기</button>
          </div>
        </div>
      </OutroContainer>
    </EntireContainer>
  );
}

export default Home;
