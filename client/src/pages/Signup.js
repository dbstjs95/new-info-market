import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { updateState } from '../store/slices/userInfo.js';
import { selectUserInfo } from '../store/slices/userInfo';

const EntireContainer = styled.div`
  * {
    font-family: 'Elice Bold';
    font-family: '순천B';
    /* border: 1px solid red; */
  }
  background: rgba(217, 213, 204, 0.3);
  padding: 30px 0;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  -webkit-box-shadow: 27px 43px 43px -26px rgba(89, 89, 89, 0.39);
  -moz-box-shadow: 27px 43px 43px -26px rgba(89, 89, 89, 0.39);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 00 1px 3px rgba(0, 0, 0, 0.88);
`;

const SignupContainer = styled.div`
  width: 100vw;
  /* 고침 */
  height: 90vh;
  background: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-box-shadow: 27px 43px 43px -26px rgba(89, 89, 89, 0.39);
  -moz-box-shadow: 27px 43px 43px -26px rgba(89, 89, 89, 0.39);
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 00 1px 3px rgba(0, 0, 0, 0.88);
`;

const SignupFormContainer = styled.div`
  background: #f5f5f5;
  width: 1000px;
  display: flex;
  box-shadow: 10px black;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    > div {
      width: 100%;
      border-radius: 0;
      padding: 20px 0;
      &:first-of-type {
        > p {
          font-size: 18px;
          padding-top: 20px;
        }
      }
    }
  }
`;

const SignupFormLeft = styled.div`
  width: 45%;
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
    padding-top: 25px;
    font-size: 20px;
    text-align: left;
    opacity: 0.8;
  }
  > div {
    padding-top: 40px;
    input[type='radio'] {
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
    @media screen and (max-width: 450px) {
      input[type='radio'] {
        width: 1em;
        height: 1em;
      }
      label {
        font-size: 0.9em;
      }
    }
  }
`;

const SignupFormRight = styled.div`
  width: 55%;
  border-radius: 0px 10px 10px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgb(255, 255, 255);
  padding: 30px 0;
`;

const SignupTopWrap = styled.div`
  align-self: flex-end;
  color: crimson;
  font-size: 16px;
  padding-right: 30px;
  @media screen and (max-width: 480px) {
    font-size: 14px;
    padding-right: 15px;
  }
`;

const SignupInputContainer = styled.div`
  margin-top: 10px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 350px) {
    width: 100%;
  }
`;

const SignupBtnWrap = styled.div`
  width: 90%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  > input {
    width: 100%;
    background: none;
    line-height: 45px;
    padding: 0 10px;
    &:first-child {
      margin-bottom: 3px;
    }
    &:focus {
      outline: none;
    }
  }
  > .signup-btn {
    width: 100%;
    height: 35px;
    color: white;
    border: 0;
    border-radius: 4px;
    background: linear-gradient(162deg, #757677 0%, #888e97 70%, #a5a8ad 70%);
  }
`;

const Msg = styled.div`
  width: 100%;
  color: crimson;
  font-size: 13px;
  margin-top: 1px;
  &.checked {
    color: blue;
  }
  &.password-msg {
    margin-bottom: 5px;
  }
`;

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin } = useSelector(selectUserInfo);

  const [role, setRole] = useState('일반');
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    phone: '',
    nickname: '',
  });
  const [checked, setChecked] = useState({
    emailCk: false,
    passwordCk: false,
    phoneCk: true, //나중에 고치기
    nicknameCk: false,
  });
  const [message, setMessage] = useState({
    emailMsg: null,
    passwordMsg: null,
    rePasswordMsg: null,
    phoneMsg: null,
    nicknameMsg: null,
    result: null,
  });

  useEffect(() => {
    if (isLogin) navigate('/main');
  }, []);

  //라디오 버튼 체크
  const handleRoleCheck = (e) => {
    setRole(e.target.value);
  };

  //입력값 상태로 저장
  const handleInputValue = (key) => (e) => {
    if (key === 'phone') {
      setUserInfo({ ...userInfo, [key]: `${e.target.value}` });
      setChecked({ ...checked, phoneCk: false });
      setMessage({ ...message, phoneMsg: '' });
      return;
    } else {
      setUserInfo({ ...userInfo, [key]: e.target.value });
    }
    setChecked({ ...checked, [`${key}Ck`]: false });
    setMessage({ ...message, [`${key}Msg`]: '' });

    // if (key === 'email') {
    //   setChecked({ ...checked, emailCk: false });
    //   setMessage({ ...message, emailMsg: '' });
    // }
    // if (key === 'nickname') {
    //   setChecked({ ...checked, nicknameCk: false });
    //   setMessage({ ...message, nicknameMsg: '' });
    // }
  };

  //이메일 인증 버튼 클릭:
  const handleEmailCheck = (e) => {
    e.preventDefault();
    const emailRegex =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (!userInfo.email)
      return setMessage({
        ...message,
        emailMsg: '이메일을 입력해주세요.',
      });
    if (!emailRegex.test(userInfo.email))
      return setMessage({
        ...message,
        emailMsg: '이메일 형식으로 입력해주세요.',
      });

    //이메일 인증 api 작성...
    //모달창 뜨고 '해당 이메일로 인증번호가 발송되었습니다. 인증번호를 입력해주세요'라는 내용, 인증번호 입력창, 확인버튼, 에러메세지 포함.
    setChecked({ ...checked, emailCk: true });
    setMessage({ ...message, emailMsg: '인증되었습니다.' });
  };

  //비밀번호 유효성 검사
  const handlePwdCheck = (e) => {
    setUserInfo({ ...userInfo, password: e.target.value });
    setChecked({ ...checked, passwordCk: false });
    setMessage({ ...message, passwordMsg: '' });

    const pwdRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!pwdRegex.test(e.target.value)) {
      return setMessage({
        ...message,
        passwordMsg:
          '최소 8자, 하나 이상의 문자, 하나의 숫자와 특수 문자를 포함해야 합니다.',
      });
    }
  };

  //비밀번호 재확인
  const handlePwdReCheck = (e) => {
    setChecked({ ...checked, passwordCk: false });
    if (userInfo.password && e.target.value !== userInfo.password) {
      return setMessage({
        ...message,
        rePasswordMsg: '일치하지 않습니다.',
      });
    }
    setMessage({ ...message, rePasswordMsg: '' });
    setChecked({ ...checked, passwordCk: true });
  };

  //핸드폰 인증 버튼 클릭
  const handlePhoneCheck = (e) => {
    e.preventDefault();
    const phoneRegex = /^01([0|1|6|7|8|9])[-]+[0-9]{4}[-]+[0-9]{4}$/;
    if (!phoneRegex.test(userInfo.phone)) {
      return setMessage({
        ...message,
        phoneMsg: `형식에 맞게('-'를 포함) 입력해주세요.`,
      });
    }
    //인증번호 받아서 인증하는 api...
    setMessage({ ...message, phoneMsg: '인증되었습니다.' });
    setChecked({ ...checked, phoneCk: true });
  };

  //닉네임 중복검사 클릭
  const handleNicknameCheck = (e) => {
    e.preventDefault();
    setChecked({ ...checked, nicknameCk: true }); //나중에 삭제
    // axios
    //   .get(`${process.env.REACT_APP_SERVER_DEV_URL}/users/${userInfo.nickname}`)
    //   .then((res) => setChecked({ ...checked, nicknameCk: true }))
    //   .catch((err) => {
    //     if (err.response?.message) {
    //       return setMessage({
    //         ...message,
    //         nicknameMsg: err.response.message,
    //       });
    //     }
    //     alert('서버 에러: 닉네임 중복 검사 요청 실패');
    //   });
    setMessage({ ...message, nicknameMsg: '사용 가능한 닉네임입니다.' });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const { email, password, phone, nickname } = userInfo;
    const { emailCk, passwordCk, phoneCk, nicknameCk } = checked;

    const normalURL = `${process.env.REACT_APP_SERVER_DEV_URL}/auth/signup`;
    const adminURL = `${process.env.REACT_APP_SERVER_DEV_URL}/admin/signup`;

    if (role === '관리자') {
      if (!email || !password || !emailCk || !passwordCk) {
        return setMessage({
          ...message,
          result: 'email, password는 필수입니다.',
        });
      }

      setMessage({ ...message, result: '' });

      axios
        .post(
          adminURL,
          { email, password },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          const { id } = res.data;
          if (id) {
            alert('회원가입 성공');
            dispatch(updateState({ id }));
            navigate(`/login`, { state: true });
          }
        })
        .catch((err) => {
          console.log('에러: ', err);
          alert(err.response.message);
        });
    } else {
      if (!email || !password || !phone || !nickname) {
        return setMessage({ ...message, result: '모두 입력해주세요.' });
      }

      if (!emailCk || !passwordCk || !phoneCk || !nicknameCk) {
        return setMessage({ ...message, result: '모두 인증해주세요.' });
      }

      setMessage({ ...message, result: '' });

      axios
        .post(
          normalURL,
          { email, password, phone, nickname },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        )
        .then((res) => {
          const { id } = res.data;
          if (id) {
            alert('회원가입 성공');
            dispatch(updateState({ id }));
            navigate(`/login`, { state: true });
          }
        })
        .catch((err) => {
          console.log('에러: ', err);
          alert(err.response.message);
        });
    }
  };
  return (
    <EntireContainer>
      {/* <SignupContainer> */}
      <SignupFormContainer>
        <SignupFormLeft>
          <h1>Info-Market</h1>
          <p>회원가입 페이지 입니다</p>
          <p>모든 항목을 입력해 주세요</p>
          <div>
            <input
              id="user"
              type="radio"
              name="role"
              value="일반"
              checked={role === '일반'}
              onChange={handleRoleCheck}
            />
            <label for="user" style={{ marginRight: '15px' }}>
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
            <label for="admin">관리자</label>
          </div>
        </SignupFormLeft>
        <SignupFormRight>
          <SignupTopWrap>*모든 항목은 필수 입니다.</SignupTopWrap>
          <SignupInputContainer>
            <SignupBtnWrap>
              <input
                type="email"
                placeholder="아이디(email)"
                onChange={handleInputValue('email')}
              />
              <button className="signup-btn" onClick={handleEmailCheck}>
                인증
              </button>
              <Msg
                className={checked.emailCk ? 'email-msg checked' : 'email-msg'}
              >
                {message.emailMsg}
              </Msg>
            </SignupBtnWrap>
            <SignupBtnWrap>
              <input
                type="password"
                placeholder="비밀번호"
                onChange={handlePwdCheck}
              />
              <Msg className="password-msg">{message.passwordMsg}</Msg>
              <input
                type="password"
                placeholder="비밀번호 재확인"
                onChange={handlePwdReCheck}
              />
              <Msg className="rePassword-msg">{message.rePasswordMsg}</Msg>
            </SignupBtnWrap>
            <SignupBtnWrap>
              <input
                type="tel"
                placeholder="010-0000-0000"
                onChange={handleInputValue('phone')}
                disabled={role === '관리자'}
              />
              <button
                className="signup-btn"
                onClick={handlePhoneCheck}
                disabled={role === '관리자'}
              >
                인증번호받기
              </button>
              <Msg
                className={checked.phoneCk ? 'phone-msg checked' : 'phone-msg'}
              >
                {message.phoneMsg}
              </Msg>
            </SignupBtnWrap>
            <SignupBtnWrap>
              <input
                type="text"
                placeholder="닉네임"
                onChange={handleInputValue('nickname')}
                disabled={role === '관리자'}
              />
              <button
                className="signup-btn"
                onClick={handleNicknameCheck}
                disabled={role === '관리자'}
              >
                중복검사
              </button>
              <Msg className={checked.emailCk ? 'checked' : ''}>
                {message.nicknameMsg}
              </Msg>
            </SignupBtnWrap>
            <SignupBtnWrap>
              <button
                className="signup-btn"
                type="submit"
                onClick={handleSignup}
              >
                회원가입
              </button>
              <Msg className="alert-box">{message.result}</Msg>
            </SignupBtnWrap>
          </SignupInputContainer>
        </SignupFormRight>
      </SignupFormContainer>
      {/* </SignupContainer> */}
    </EntireContainer>
  );
}
export default Signup;
