import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateState,
  clearState,
  selectUserInfo,
} from '../store/slices/userInfo.js';
import styled from 'styled-components';

const EntireContainer = styled.div`
  * {
    font-family: 'Elice Bold';
    font-family: '순천B';
  }
  background: rgba(217, 213, 204, 0.3);
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-shadow: 27px 43px 43px -26px rgba(89, 89, 89, 0.39);
  -moz-box-shadow: 27px 43px 43px -26px rgba(89, 89, 89, 0.39);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 00 1px 3px rgba(0, 0, 0, 0.88);
`;

const LoginFormContainer = styled.div`
  background: #f5f5f5;
  width: 60%;
  height: 60%;
  display: flex;
  box-shadow: 10px black;
  @media screen and (max-width: 1300px) {
    width: 80%;
  }
  @media screen and (max-width: 1000px) {
    width: 90%;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > div {
      border-radius: 0px 0px 10px 10px;
      width: 90%;
      padding: 40px 0;
      &:first-of-type {
        border-radius: 10px 10px 0px 0px;
      }
    }
  }
  @media screen and (max-width: 600px) {
    > div:first-of-type p {
      font-size: 18px;
    }
  }
  @media screen and (max-width: 320px) {
    > div {
      border-radius: 0;
      width: 100%;
      &:first-of-type {
        border-radius: 0;
        p {
          display: none;
        }
        label {
          font-size: 0.9rem;
        }
      }
    }
  }
`;

const LoginFormLeft = styled.div`
  width: 50%;
  border-radius: 10px 0px 0px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  background-image: radial-gradient(
    ellipse farthest-corner at 0 140%,
    #757677 0%,
    #888e97 70%,
    #a5a8ad 70%
  );
  > h1 {
    color: white;
    width: 80%;
    text-align: left;
    opacity: 0.9;
  }
  > p {
    padding-top: 30px;
    font-size: 20px;
    text-align: left;
    opacity: 0.8;
  }
  > div.radio-btn {
    margin-top: 25px;
    > input[type='radio'] {
      vertical-align: middle;
      appearance: none;
      border: max(2px, 0.1em) solid white;
      border-radius: 50%;
      width: 1.1em;
      height: 1.1em;
      margin-right: 3px;
      &:checked {
        border: 0.3em solid #fcee6a;
      }
      &:hover {
        box-shadow: 0 0 0 max(1px, 0.2em) tomato;
        cursor: pointer;
      }
      &:disabled {
        background-color: lightgray;
        box-shadow: none;
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
`;

const LoginFormRight = styled.div`
  width: 50%;
  border-radius: 0px 10px 10px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(255, 255, 255);
`;

const LoginTopWrap = styled.div`
  width: 90%;
  padding-right: 15px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > span {
    color: gray;
    font-size: 11px;
    padding-right: 15px;
  }
`;

const CreateBtn = styled.button`
  background: white;
  border: 0;
  font-size: 11px;
  color: #2178ff;
  cursor: pointer;
`;

const LoginInputContainer = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  > input {
    background: none;
    border: none;
    line-height: 45px;
    padding-left: 10px;
    width: 267px;
    border-bottom: 1px solid black;
    outline: none;
    &:first-of-type {
      margin-bottom: 15px;
    }
  }
  @media screen and (max-width: 400px) {
    padding-top: 20px;
    width: 90%;
    > input {
      width: 100%;
      font-size: 0.9rem;
    }
  }
`;

const LoginInputWrap = styled.div`
  width: 300px;
  height: 30px;
  border-radius: 2px;
  > i {
    color: #707274;
    line-height: 45px;
  }
  > input {
    background: none;
    border: none;
    line-height: 45px;
    padding-left: 10px;
    width: 267px;
    border-bottom: 1px solid black;
    outline: none;
  }
`;

const LoginBtnWrap = styled.div`
  width: 100%;
  padding-top: 50px;
  > .login-btn {
    width: 100%;
    padding: 10px 0;
    color: white;
    border: 0;
    border-radius: 4px;
    background: linear-gradient(162deg, #757677 0%, #888e97 70%, #a5a8ad 70%);
  }
  /* > .kakao-login {
    width: 100%;
    height: 35px;
    color: rgb(63, 63, 63);
    border: 0;
    border-radius: 4px;
    background: linear-gradient(
      162deg,
      yellow 0%,
      rgba(150, 150, 52, 0.377) 70%,
      #b6b4a5 100%
    );
  } */
  /* > .naver-login {
    width: 100%;
    height: 35px;
    color: white;
    border: 0;
    border-radius: 4px;
    background: linear-gradient(
      162deg,
      green 0%,
      rgba(46, 131, 46, 0.699) 70%,
      #bedbb6 70%
    );
  } */
  /* > a {
    margin-top: 10px;
    text-decoration: none;
    font-size: 11px;
    color: gray;
  } */
`;

function Login() {
  const navigate = useNavigate();
  const { state: sign } = useLocation();
  const dispatch = useDispatch();
  const { email, password } = useSelector(selectUserInfo);
  const [role, setRole] = useState('일반');
  const handleRegister = () => {
    navigate(`/tos`);
  };

  const [errorMessage, setErrorMessage] = useState('');

  const handleInputValue = (key) => (e) => {
    dispatch(updateState({ [key]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setErrorMessage('이메일과 비밀번호를 입력하세요');
    } else {
      const normalURL = `${process.env.REACT_APP_SERVER_DEV_URL}/auth/login`;
      const adminURL = `${process.env.REACT_APP_SERVER_DEV_URL}/admin/login`;
      axios
        .post(
          role === '관리자' ? adminURL : normalURL,
          { email, password },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          if (res.data) {
            window.localStorage.setItem('act', res.data?.accToken);
            dispatch(
              updateState({
                ...res.data,
                isLogin: true,
              }),
            );
            //이전 페이지가 회원가입, 홈화면이면 메인으로 이동하게 하기.
            if (sign) navigate('/main');
            else navigate(-1);
          }
        })
        .catch((err) => {
          dispatch(clearState());
          const { message } = err.response.data;
          if (message) setErrorMessage(message);
        });
    }
  };

  const kakaoOauth = useRef();
  const naverOauth = useRef();
  const loginRef = useRef();
  /* 카카오, 네이버 로그인 관련 부분
    배포 및 사이트 등록이 완료되면, 해당 도메인을 redirect_uri 등록하여 bit.ly 주소를 받을 수 있음
    임시로 타 프로젝트와 연동한 부분
  */

  const handleOauth = (oauth) => {
    if (oauth === kakaoOauth) {
      window.open(
        'https://kauth.kakao.com/oauth/authorize?client_id=e163b3a1d2d8c30089a5b1b572c2b807&redirect_uri=http://localhost:3000/oauth/kakao/callback&response_type=code%27',
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') loginRef.current.click();
  };

  const handleRoleCheck = (e) => {
    setRole(e.target.value);
  };

  return (
    <EntireContainer>
      <LoginFormContainer>
        <LoginFormLeft>
          <h1>Info-Market</h1>
          <p>Info-Market 로그인 페이지입니다.</p>
          <div className="radio-btn">
            <input
              id="user"
              type="radio"
              name="role"
              value="일반"
              checked={role === '일반'}
              onChange={handleRoleCheck}
            />
            <label htmlFor="user" style={{ marginRight: '15px' }}>
              일반
            </label>
            <input
              id="admin"
              type="radio"
              name="role"
              value="관리자"
              checked={role === '관리자'}
              onChange={handleRoleCheck}
              disabled
            />
            <label htmlFor="admin">관리자</label>
          </div>
        </LoginFormLeft>
        <LoginFormRight>
          <LoginTopWrap>
            <span>아이디가 없나요?</span>
            <CreateBtn onClick={handleRegister}>계정만들기</CreateBtn>
          </LoginTopWrap>
          {/* <div className='login-top-wrap'>
              <span>비밀번호를 잃어버렸나요?</span>
              <button className="create-account-btn shadow-light">
                비밀번호찾기
              </button>
            </div>
            <div className='login-top-wrap'>
              <span>아이디를 잃어버렸나요?</span>
              <button className="create-account-btn shadow-light">
                이메일찾기
              </button>
            </div> */}
          <LoginInputContainer>
            <input
              type="email"
              placeholder="email을 입력하세요"
              onChange={handleInputValue('email')}
              onKeyPress={handleKeyPress}
              value={email}
            />
            <input
              type="password"
              placeholder="password을 입력하세요"
              onChange={handleInputValue('password')}
              onKeyPress={handleKeyPress}
              value={password}
            />
            <LoginBtnWrap>
              {/* <button
                  className="kakao-login"
                  // onClick={() => handleOauth(kakaoOauth)}
                  ref={kakaoOauth}
                >
                  카카오 로그인
                </button> */}
              <button
                className="login-btn"
                type="submit"
                onClick={handleLogin}
                ref={loginRef}
              >
                로그인
              </button>
              {!email || !password ? (
                <div className="alert-box" style={{ color: 'red' }}>
                  {errorMessage}
                </div>
              ) : null}
            </LoginBtnWrap>
          </LoginInputContainer>
        </LoginFormRight>
      </LoginFormContainer>
    </EntireContainer>
  );
}

export default Login;
