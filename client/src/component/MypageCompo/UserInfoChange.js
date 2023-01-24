import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateState,
  clearState,
  selectUserInfo,
} from '../../store/slices/userInfo';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EntireContainer = styled.div`
  /* border: 5px solid red; */
  height: 57%;
  display: flex;
  > div.first {
    border-left: 5px solid orange;
    border-right: 1px solid lightgray;
    background-color: white;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > .key {
      font-size: 2rem;
    }
    > input {
      margin: 10% 0;
      width: 60%;
    }
    > button {
      width: 30%;
    }
  }
  > form.second {
    border-top: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
    background-color: white;
    border-right: 5px solid orange;
    flex: 2;
    display: flex;
    flex-direction: column;
    > div.modifying-box {
      /* border: 3px solid green; */
      flex: 9;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > div.input-box {
        /* border: 1px solid red; */
        margin-bottom: 10px;
        > input {
          font-size: 1rem;
        }
        > p {
          margin: 0;
          font-size: 0.8rem;
        }
        > input#new-pwd-check {
          margin-top: 1rem;
        }
      }
      > div#pwd-box {
        display: flex;
        flex-direction: column;
      }
      > button.account {
        min-width: 20%;
        padding: 2%;
        background-color: orange;
        font-size: 1rem;
      }
    }
    > div.confirm {
      /* border: 3px solid black; */
      border-top: 1px solid lightgray;
      padding-top: 15px;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      > button {
        margin-right: 2%;
        font-size: 1rem;
      }
    }
  }
`;

function UserInfoChange() {
  const { isLogin, id, email, password, nickname, phone } =
    useSelector(selectUserInfo);
  const accToken = localStorage.getItem('act');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const [locked, setLocked] = useState(true);
  const [pwdCheckInput, setPwdCheckInput] = useState('');
  const [inputVal, setInputVal] = useState({
    email: '',
    nickname: '',
    phone: '',
    password: '',
    rePwd: '',
    account: '',
    phoneAuthentication: false,
    emailAuthentication: false,
    nickNameAuthentication: false,
  });
  const [errorMsg, setErrorMsg] = useState({
    email: '',
    nickname: '',
    phone: '',
    password: '',
    rePwd: '',
  });

  //회원정보수정 접근 권한 얻기
  const checkPwd = () => {
    if (pwdCheckInput === password) setLocked(false);
    setPwdCheckInput('');
  };

  //회원정보수정 인풋값 반영
  const handleChange = (e) => {
    if (e.target.name === 'email') emailCheck(e.target.value);
    if (e.target.name === 'nickname') nickNameCheck(e.target.value);
    if (e.target.name === 'phone') phoneCheck(e.target.value);
    if (e.target.name === 'password') pwdCheck(e.target.value);
    if (e.target.name === 'rePwd') rePwdCheck(e.target.value);
  };

  useEffect(() => {
    if (!isLogin) navigate('/main');
  }, [isLogin]);

  //이메일 값에 따른 에러메세지 상태 변화
  const emailCheck = (inputEmail) => {
    setInputVal({ ...inputVal, email: inputEmail, emailAuthentication: false });

    const emailRegex =
      /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (!inputEmail) return setErrorMsg({ ...errorMsg, email: '' });
    if (inputEmail === email)
      return setErrorMsg({ ...errorMsg, email: '변화가 없습니다.' });
    if (!emailRegex.test(inputEmail))
      return setErrorMsg({ ...errorMsg, email: '이메일 형식으로 적어주세요.' });
    if (!inputVal.emailAuthentication)
      return setErrorMsg({ ...errorMsg, email: '인증해주세요.' });
    setErrorMsg({ ...errorMsg, email: '' });
  };

  //닉네임 값에 따른 에러메세지 상태 변화
  const nickNameCheck = (inputNickName) => {
    setInputVal({
      ...inputVal,
      nickname: inputNickName,
      nickNameAuthentication: false,
    });
    if (!inputNickName) return setErrorMsg({ ...errorMsg, nickname: '' });
    if (inputNickName === nickname)
      return setErrorMsg({ ...errorMsg, nickname: '변화가 없습니다.' });
    if (!inputVal.nickNameAuthentication)
      return setErrorMsg({
        ...errorMsg,
        nickname: '중복검사를 해주세요.',
      });

    setErrorMsg({ ...errorMsg, nickname: '' }); //서버테스트후 삭제여부 결정
  };

  //핸드폰 번호 값에 따른 에러메세지 상태 변화
  const phoneCheck = (inputPhone) => {
    setInputVal({ ...inputVal, phone: inputPhone, phoneAuthentication: false });

    const phoneRegex = /^01([0|1|6|7|8|9])[-]+[0-9]{4}[-]+[0-9]{4}$/;

    if (!inputPhone) return setErrorMsg({ ...errorMsg, phone: '' });
    if (inputPhone === phone)
      return setErrorMsg({ ...errorMsg, phone: '변화가 없습니다.' });
    if (!phoneRegex.test(inputPhone))
      return setErrorMsg({
        ...errorMsg,
        phone: '휴대폰 번호 형식으로 적어주세요.',
      });
    if (!inputVal.phoneAuthentication)
      return setErrorMsg({
        ...errorMsg,
        phone: '인증해주세요.',
      });

    setErrorMsg({ ...errorMsg, phone: '' }); //서버테스트후 삭제여부 결정
  };

  //비밀번호 값에 따른 에러메세지 상태 변화
  const pwdCheck = (inputPwd) => {
    setInputVal({
      ...inputVal,
      password: inputPwd,
    });

    const pwdRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!inputPwd) return setErrorMsg({ ...errorMsg, password: '' });
    if (inputPwd === password)
      return setErrorMsg({ ...errorMsg, password: '변화가 없습니다.' });

    if (!pwdRegex.test(inputPwd))
      return setErrorMsg({
        ...errorMsg,
        password: '최소 8자, 하나 이상의 문자, 하나의 숫자와 특수 문자 포함',
      });

    setErrorMsg({ ...errorMsg, password: '' });
  };

  //비밀번호 일치여부에 따른 에러메세지 상태 변화
  const rePwdCheck = (inputRePwd) => {
    setInputVal({
      ...inputVal,
      rePwd: inputRePwd,
    });

    const { password } = inputVal;
    if (inputRePwd && inputRePwd !== password)
      return setErrorMsg({
        ...errorMsg,
        rePwd: '일치하지 않습니다.',
      });

    setErrorMsg({ ...errorMsg, rePwd: '' });
  };

  //수정 버튼 활성화 조건: 에러 메세지가 안 뜨면서, 수정될 값이 있을 때만 활성화.
  const activateUpdateBtn = () => {
    const { email, nickname, phone, password, rePwd } = inputVal;
    return (
      !locked &&
      (password ? password === rePwd : !rePwd) &&
      Object.values(errorMsg).every((msg) => msg === '') &&
      [email, nickname, phone, password].some((val) => val !== '')
    );
  };

  //닉네임 중복검사 버튼 클릭 이벤트
  const isValidNickName = (e) => {
    e.preventDefault();
    if (inputVal.nickname === nickname) {
      setErrorMsg({
        ...errorMsg,
        nickname: '현재 사용 중인 닉네임입니다.',
      });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/users/nickname`,
          {
            nickname: inputVal.nickname,
          },
          postConfig,
        )
        .then((res) => {
          setInputVal({ ...inputVal, nickNameAuthentication: true });
          setErrorMsg({ ...errorMsg, nickname: '' });
        })
        .catch((err) => {
          setErrorMsg({
            ...errorMsg,
            nickname: err.response?.message || '닉네임 변경 불가',
          });
          setInputVal({ ...inputVal, nickname: '' });
        });
    }
  };

  //핸드폰 인증 버튼 클릭 이벤트
  const phoneAuthentication = (e) => {
    e.preventDefault();
    if (inputVal.phone === phone) {
      setErrorMsg({
        ...errorMsg,
        phone: '사용 중인 번호입니다.',
      });
    } else {
      //인증완료후
      setInputVal({ ...inputVal, phoneAuthentication: true });
      setErrorMsg({ ...errorMsg, phone: '' }); //서버테스트후 삭제여부 결정
    }
  };

  //이메일 인증 버튼 클릭 이벤트
  const emailAuthentication = (e) => {
    e.preventDefault();
    if (inputVal.email === email || inputVal.emailAuthentication) {
      setErrorMsg({
        ...errorMsg,
        email: '이미 인증된 이메일입니다.',
      });
    } else {
      //인증완료후
      setInputVal({ ...inputVal, emailAuthentication: true });
      setErrorMsg({ ...errorMsg, email: '' }); //서버테스트후 삭제여부 결정
    }
  };

  //회원정보수정 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    // const userInfoObj = { email, nickname, phone, password };
    const { email, nickname, phone, password } = inputVal;
    let tempObj = { email, nickname, phone, password };
    let resultObj = {};

    //1. '값'이 있는 속성만 추출해서 보내기
    for (let key in tempObj) {
      if (tempObj[key]) resultObj = { ...resultObj, [key]: tempObj[key] };
    }
    //2. '값'이 없는 속성은 기본값으로 세팅해서 보내기
    // for (let key in tempObj) {
    //   if (!tempObj[key]) tempObj[key] = userInfoObj[key]
    // }
    // resultObj = {...tempObj}

    axios
      .put(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/userInfo/${id}`,
        resultObj,
        postConfig,
      )
      .then((res) => {
        dispatch(updateState(resultObj));
        setLocked(true);
        alert('회원정보가 수정되었습니다.');
      })
      .catch((err) => alert('서버 에러 발생! 다시 시도해주세요.'));
  };

  //회원탈퇴
  const handleWithdrawal = (e) => {
    e.preventDefault();
    axios
      .delete(`${process.env.REACT_APP_SERVER_DEV_URL}/auth/${id}`, getConfig)
      .then((res) => dispatch(clearState()))
      .catch((err) => alert('서버 에러 발생! 다시 시도해주세요.'));
  };

  return (
    <EntireContainer>
      <div className="first">
        <FontAwesomeIcon
          className="pwd-check key"
          icon={locked ? faLock : faLockOpen}
        />
        <input
          type="password"
          className="pwd-check"
          placeholder={locked ? 'password' : 'checked'}
          disabled={!locked}
          value={pwdCheckInput}
          onChange={(e) => setPwdCheckInput(e.target.value)}
        />
        <button className="pwd-check" disabled={!locked} onClick={checkPwd}>
          확인
        </button>
      </div>
      <form className="second">
        <div className="modifying-box">
          <div className="input-box">
            <input
              name="email"
              className="content"
              type="email"
              placeholder={email}
              disabled={locked}
              onChange={handleChange}
            />
            <button disabled={locked} onClick={emailAuthentication}>
              인증
            </button>
            <p className="error-message">{errorMsg.email}</p>
          </div>

          <div className="input-box">
            <input
              name="nickname"
              className="content"
              type="text"
              placeholder={nickname}
              disabled={locked}
              onChange={handleChange}
            />
            <button disabled={locked} onClick={isValidNickName}>
              중복검사
            </button>
            <p className="error-message">{errorMsg.nickname}</p>
          </div>

          <div className="input-box">
            <input
              name="phone"
              className="content"
              type="tel"
              placeholder={phone}
              disabled={locked}
              onChange={handleChange}
            />
            <button disabled={locked} onClick={phoneAuthentication}>
              인증
            </button>
            <p className="error-message">{errorMsg.phone}</p>
          </div>

          <div id="pwd-box" className="input-box">
            <input
              name="password"
              id="new-pwd"
              type="password"
              value={inputVal.password}
              placeholder="새 비밀번호"
              disabled={locked}
              onChange={handleChange}
            />
            <p className="error-message">{errorMsg.password}</p>
            <input
              name="rePwd"
              id="new-pwd-check"
              type="password"
              value={inputVal.rePwd}
              placeholder="비밀번호 확인"
              disabled={locked}
              onChange={handleChange}
            />
            <p className="error-message">{errorMsg.rePwd}</p>
          </div>
          <button
            style={{ whiteSpace: 'nowrap' }}
            className="account"
            // disabled={locked}
            disabled
          >
            계좌 인증 하기
          </button>
        </div>
        <div className="confirm">
          <button disabled={locked} onClick={handleWithdrawal}>
            회원 탈퇴
          </button>
          <button disabled={!activateUpdateBtn()} onClick={handleSubmit}>
            수정
          </button>
        </div>
      </form>
    </EntireContainer>
  );
}

export default UserInfoChange;
