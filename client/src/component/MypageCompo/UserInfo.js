import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import user from '../../images/user.png';
import Modal from '../../modals/Modal-1.js';
import { useDispatch, useSelector } from 'react-redux';
import { updateState, selectUserInfo } from '../../store/slices/userInfo';
import {
  selectPoint,
  updatePointState,
  initPayment,
} from '../../store/slices/point';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import ChargeBox from '../ChargeBox';
import AWS from 'aws-sdk';
import { v1, v3, v4, v5 } from 'uuid';

const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_AWS_DEFAULT_REGION;
const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const EntireContainer = styled.div`
  /* border: 5px solid blue; */
  height: 100%;
  @media screen and (max-width: 800px) {
    font-size: 0.9rem;
  }
  @media screen and (max-width: 590px) {
    font-size: 0.7rem;
  }
  > div.modal div.content {
    max-width: 600px;
    &.payment {
      /* 모달창 배경색 */
      background-color: #f3f702;
    }

    @media screen and (max-width: 700px) {
      > div.charge-box {
        font-size: 0.8rem;
        > input,
        button {
          font-size: inherit;
        }
      }
    }
  }
  > ul#user-Info-container {
    margin-top: 0;
    border: 5px solid orange;
    border-radius: 5px;
    font-weight: bold;
    min-height: 25%;
    background-color: white;
    display: flex;
    list-style: none;
    padding-left: 0;
    align-items: center;
    justify-content: space-around;
    > li {
      /* border: 1px dotted black; */
      height: 200px;
      &:nth-child(2) {
        border-left: 1px solid lightgray;
        border-right: 1px solid lightgray;
      }
      &.profile {
        /* flex: 3; */
        min-width: 35%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        @media screen and (max-width: 800px) {
          flex-direction: column;
        }
        > div {
          /* border: 3px solid purple; */
          margin: 0 5px 0 5px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          &#grade {
            /* border: 3px solid blue; */
            border-radius: 3px;
            padding: 3% 2%;
            background-color: #555c5c;
            color: white;
          }
          > figure {
            margin: 0;
            margin-bottom: 8px;
            /* border: 1px solid black; */
            min-width: 80px;
            min-height: 80px;
            border-radius: 50%;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            @media screen and (max-width: 700px) {
              min-width: 60px;
              min-height: 60px;
            }
          }
        }
      }
      &.my-points {
        /* flex: 2; */
        min-width: 35%;
        display: flex;
        justify-content: center;
        /* align-items: center; */
        /* border: 1px solid green; */

        > div.detail {
          /* border: 2px solid black; */
          /* flex: 6; */
          width: 85%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: stretch;
          > div {
            /* border: 1px solid blue; */
            margin: 0;
            /* width: 80%; */
            &#charged {
              /* margin-bottom: 5%; */
            }
            &#earnings {
              /* margin-bottom: 7px; */
            }
            > p {
              /* border: 1px solid orange; */
              &:nth-child(1) {
                background-color: #fa9c19;
                border-radius: 5px;
                padding: 3% 1%;
                color: white;
              }
              margin: 0;
              text-align: center;
              &.amount {
                padding: 4% 2%;
                border: 1px solid lightgray;
                border-radius: 5px;
              }
            }
          }
        }
      }

      &.charging-withdrawal {
        /* border: 1px solid gray; */
        min-width: 30%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        > button {
          margin: 10px 0;
          padding: 2%;
          font-size: 1rem;
          @media screen and (max-width: 800px) {
            font-size: 0.9rem;
          }
          @media screen and (max-width: 590px) {
            font-size: 0.7rem;
          }
        }
      }
    }
  }
`;

const Preview = styled.div`
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > div.btns {
    > button {
      padding: 5px 2px;
      &:nth-child(1) {
        margin-right: 10px;
      }
    }
  }
`;

function UserInfo() {
  const dispatch = useDispatch();
  const {
    id,
    nickname,
    profileImg,
    point,
    grade,
    earnings,
    previewImg,
    progress,
    showAlert,
  } = useSelector(selectUserInfo);
  const accToken = localStorage.getItem('act');
  const { modalOpen } = useSelector(selectPoint);
  const fileInput = useRef(null);
  const [selectedFile, setSelectedFile] = useState('');

  //서버 통신 헤더: post용, get용
  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };
  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //처음 렌더링때 작동: 유저정보 불러오기
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/userinfo/${id}`,
        getConfig,
      )
      .then((res) => {
        const { user } = res.data;
        console.log('user: ', user);
        if (user) {
          delete user.password;
          dispatch(updateState({ ...user, profileImg: user.img }));
        }
      })
      .catch((err) => {
        alert('회원정보 불러오기 실패');
      });
  }, []);

  //포인트 결제 모달 열기
  const handleModalOpen = (e) => {
    e.preventDefault();
    dispatch(
      updatePointState({
        modalOpen: true,
      }),
    );
  };

  //프로필 사진을 클릭하면 파일 업로드 input창이 클릭됨.
  const profileBtnClick = (e) => {
    e.preventDefault();
    fileInput.current.click();
  };

  //선택한 이미지파일 --> 미리보기
  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        dispatch(
          updateState({
            previewImg: reader.result,
          }),
        );
        resolve();
      };
    });
  };

  //모달 안의 프로필 변경 버튼 클릭
  const handleChangeImg = () => {
    if (profileImg) {
      let temp = profileImg;
      deleteImg(temp);
    }
    saveImg(selectedFile, 'image');
  };

  //s3에 파일 전송.
  const saveImg = (file, path) => {
    const fileName = `${path}/${v4().toString().replaceAll('-', '')}.${
      file.type.split('/')[1]
    }`;
    const params = {
      ACL: 'public-read-write',
      Body: file,
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    myBucket
      .putObject(params, (err, data) => {
        //서버로 profileImg 값 보내주기.(일단 임시로 작성)
        axios
          .post(
            `${process.env.REACT_APP_SERVER_DEV_URL}/users/${id}/img`,
            { profileImg: fileName },
            postConfig,
          )
          .then((res) => {
            dispatch(
              updateState({
                profileImg: fileName,
              }),
            );
          })
          .catch((err) => alert('파일업로드 주소가 서버에 반영 안 됨.'));
      })
      .on('httpUploadProgress', (evt) => {
        dispatch(
          updateState({
            progress: Math.round((evt.loaded / evt.total) * 100),
            showAlert: true,
          }),
        );
        setTimeout(() => {
          setSelectedFile('');
          dispatch(
            updateState({
              showAlert: false,
              previewImg: null,
            }),
          );
        }, 2000);
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  //미리보기 모달창 취소버튼
  const handleCancleClick = (e) => {
    e.preventDefault();
    if (showAlert) return;

    setSelectedFile(null);
    dispatch(
      updateState({
        previewImg: null,
      }),
    );
    fileInput.current.value = '';
  };

  //s3에 있는 파일 삭제
  const deleteImg = (fileName, callback) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    const cb = (err, data) => {
      if (data) alert('삭제 성공');
      if (err) alert('삭제 실패');
    };

    myBucket.deleteObject(params, callback || cb);
  };

  //기본 이미지로 변경 버튼 클릭
  const resetImg = () => {
    //s3 이미지 삭제후, 서버에 반영하고 난 후 아래코드 작동.
    const deleteDB = () => {
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/users/${id}/img`,
          { profileImg: '' },
          postConfig,
        )
        .then((res) => {
          fileInput.current.value = '';
          dispatch(
            updateState({
              profileImg: null,
            }),
          );
        })
        .catch((err) => console.log(err));
    };

    deleteImg(profileImg, deleteDB);
  };

  return (
    <EntireContainer>
      {modalOpen && (
        <Modal
          role="payment"
          handleBtnClick={() => {
            dispatch(
              updatePointState({
                modalOpen: false,
              }),
            );
            dispatch(initPayment());
          }}
          content={<ChargeBox />}
        />
      )}
      {previewImg && (
        <Modal
          role="previewImg"
          content={
            <Preview>
              <img
                src={previewImg}
                style={{
                  height: '15vh',
                }}
                alt="preview-img"
              />
              <div className="btns">
                <button onClick={handleChangeImg} disabled={showAlert}>
                  프로필 변경하기
                </button>
                <button disabled={showAlert} onClick={handleCancleClick}>
                  취소
                </button>
              </div>
              {/* {!showAlert && <p>업로드 진행률: {progress} %</p>} */}
            </Preview>
          }
          handleBtnClick={handleCancleClick}
        />
      )}
      <ul id="user-Info-container">
        <li className="profile">
          <input
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            name="profile-img"
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
              encodeFileToBase64(e.target.files[0]);
            }}
            ref={fileInput}
          />
          <div className="user-photo">
            <figure
              style={{
                backgroundImage: `url(${
                  profileImg
                    ? `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/` +
                      profileImg
                    : user
                })`,
              }}
              onClick={profileBtnClick}
            />
            {/* 프로필 초기화 */}
            {profileImg && (
              <span style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon onClick={resetImg} icon={faRotateLeft} />
              </span>
            )}
          </div>
          <div style={{ whiteSpace: 'nowrap' }}>{nickname}</div>
          <div id="grade" style={{ whiteSpace: 'nowrap' }}>
            {grade}
          </div>
        </li>
        <li className="my-points">
          <div className="detail">
            <div id="charged">
              <p style={{ whiteSpace: 'nowrap' }}>충전 포인트</p>
              <p className="amount">{point} P</p>
            </div>
            <div id="earnings">
              <p style={{ whiteSpace: 'nowrap' }}>누적 수익 포인트</p>
              <p className="amount">{earnings} P</p>
            </div>
          </div>
        </li>
        <li className="charging-withdrawal">
          <button onClick={handleModalOpen} style={{ whiteSpace: 'nowrap' }}>
            포인트 충전
          </button>
          <button style={{ whiteSpace: 'nowrap' }}>포인트 출금</button>
        </li>
      </ul>
      <Outlet />
    </EntireContainer>
  );
}

export default UserInfo;
