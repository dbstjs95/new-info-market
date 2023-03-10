import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';
import { LoadingContainer } from '../../pages/user/Mainpage';

const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_AWS_DEFAULT_REGION;
const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  apiVersion: '2006-03-01',
});

export const LoadingContainer2 = styled(LoadingContainer)`
  position: fixed;
`;

const FormContainer = styled.form`
  * {
    /* border: 1px solid red; */
  }
  width: 95%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin: 0 auto;
  padding: 25px;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  > input#title,
  > textarea#content,
  > input#price {
    outline: none;
    padding: 10px;
    border: 0;
    border-radius: 5px;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.2);
    @media screen and (max-width: 600px) {
      font-size: 0.9rem;
    }
  }
  > input#title {
    margin-bottom: 15px;
  }
  > textarea#content {
    min-height: 400px;
    margin-bottom: 30px;
    resize: none;
  }
  > input#price {
    width: 150px;
    padding: 5px;
    margin-bottom: 20px;
    font-size: 0.9rem;
  }
  > div.submit {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > span.msg {
      display: none;
      &.alert {
        display: block;
        color: crimson;
        font-size: 0.8rem;
      }
    }
    > button#submit {
      margin-left: 15px;
      padding: 5px 10px;
      background-color: #9b02a6;
      border: 0;
      color: white;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      &:not(:disabled) {
        &:hover {
          box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3);
        }
      }
      &:disabled {
        background-color: #caa7cc;
        cursor: not-allowed;
      }
      @media screen and (max-width: 1024px) {
        font-size: 0.9rem;
      }
      @media screen and (max-width: 600px) {
        font-size: 0.8rem;
      }
    }
  }
`;

const FileBox = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > input {
    font-size: 0.9rem;
    color: #2458a6;
  }
  > span {
    display: none;
    color: #444;
    font-size: 0.9rem;
    margin-left: 10px;
    border: 1px solid lightgray;
    padding: 3px 5px;
    background-color: whitesmoke;
    cursor: pointer;
    &:hover {
      color: #222;
      box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.1);
    }
    &.need {
      display: block;
    }
  }
`;

function FreeWriting({ paid = false }) {
  const accToken = localStorage.getItem('act');
  const [Loading, setLoading] = useState(false);
  const { isLogin, grade } = useSelector(selectUserInfo);
  const navigate = useNavigate();

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //?????? ????????? input
  const fileInput = useRef(null);

  //????????? ??????, ?????? ?????????
  const [textValues, setTextValues] = useState({
    title: null,
    content: null,
    targetPoint: null,
  });

  //???????????? ?????? ?????????
  const [selectedFile, setSelectedFile] = useState(null);

  //????????? ?????? ??????(?????? ??????)
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const { title, content, targetPoint } = textValues;
    axios
      .post(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info`,
        {
          type: paid ? 'Paid' : 'Free',
          targetPoint: targetPoint || 0,
          title,
          content,
          file: '',
        },
        postConfig,
      )
      .then((res) => {
        if (res.data.infoId) alert('?????? ?????????????????????.');
        setTextValues({
          title: '',
          content: '',
          targetPoint: '',
        });
        navigate('/mypage/info/myposts');
      })
      .catch((err) => {
        alert('?????? ?????? ??????! ?????? ??????????????????.');
      })
      .finally(() => setLoading(false));
  };

  //????????? ?????? ??????(?????? ?????????)
  const handleSubmitWithFile = (e) => {
    e.preventDefault();
    setLoading(true);
    const fileName = `info/${v4().toString().replaceAll('-', '')}.${
      selectedFile.type.split('/')[1]
    }`;

    const myBucket = new AWS.S3.ManagedUpload({
      params: {
        Bucket: S3_BUCKET, // ?????? ??????
        Key: fileName,
        Body: selectedFile, // ?????? ??????
      },
    }).promise();

    myBucket
      .then(() => {
        //????????? ?????? ?????? ?????????.
        const { title, content, targetPoint } = textValues;
        axios
          .post(
            `${process.env.REACT_APP_SERVER_DEV_URL}/info`,
            {
              type: paid ? 'Paid' : 'Free',
              targetPoint: targetPoint || 0,
              title,
              content,
              file: fileName,
            },
            postConfig,
          )
          .then((res) => {
            fileInput.current.value = '';
            if (res.data.infoId) alert('?????? ?????????????????????.');
            setLoading(false);
            navigate('/mypage/info/myposts');
          })
          .catch((err) => {
            deleteFile(fileName);
            console.error(err);
            setLoading(false);
            alert('??????????????? ????????? ????????? ?????? ??? ???.');
          });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        alert('?????? ???????????? ??????????????????.');
      });
  };

  //?????? ??????
  const deleteFile = (fileName) => {
    const myBucket = new AWS.S3();
    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    myBucket.deleteObject(params, (err, data) => {
      if (data) console.log('s3?????? ??????');
      if (err) console.log('s3?????? ?????? ??????');
    });
  };

  //?????? ??????
  const handleInputChange = (e) => {
    // const fileObj = e.target.files[0];
    // const ext = fileObj.name.split('.').pop();
    setSelectedFile(e.target.files[0]);
  };

  //?????? ?????? ??????
  const handleCancel = (e) => {
    e.preventDefault();
    fileInput.current.value = null;
    setSelectedFile(null);
  };

  const handleSubmitBtn = () =>
    paid
      ? textValues.title && textValues.content && textValues.targetPoint
      : textValues.title && textValues.content;

  useEffect(() => {
    if (!accToken && !isLogin) return navigate('/main');
    if (paid && grade === 'Bronze') {
      alert('?????? ???????????? ???????????????.');
      navigate(-1);
    }
  }, [paid]);

  return (
    <FormContainer>
      {Loading && (
        <LoadingContainer2 bg={'rgba(0,0,0,0.1)'}>loading...</LoadingContainer2>
      )}
      <input
        name="title"
        id="title"
        placeholder="??????"
        maxLength="100"
        defaultValue={textValues?.title}
        onChange={(e) =>
          setTextValues({ ...textValues, title: e.target.value })
        }
      />
      <textarea
        name="content"
        id="content"
        placeholder="????????? ????????? ?????? ????????? ????????? ???????????????."
        defaultValue={textValues?.content}
        onChange={(e) =>
          setTextValues({ ...textValues, content: e.target.value })
        }
      ></textarea>
      <FileBox className="file-upload">
        <input
          type="file"
          accept="image/*, .pdf, .hwp, application/vnd.ms-excel, text/plain, text/html"
          onChange={handleInputChange}
          ref={fileInput}
        />
        <span className={selectedFile ? 'need' : ''} onClick={handleCancel}>
          ?????? ??????
        </span>
      </FileBox>
      {paid && (
        <input
          id="price"
          name="targetPoint"
          type="text"
          placeholder="??????"
          defaultValue={textValues?.targetPoint}
          onChange={(e) =>
            setTextValues({ ...textValues, targetPoint: e.target.value })
          }
        />
      )}
      <div className="submit">
        <span className={handleSubmitBtn() ? 'msg' : 'msg alert'}>
          {paid
            ? '??????, ??????, ?????? ?????? ??????????????????.'
            : '????????? ?????? ?????? ??????????????????.'}
        </span>
        <button
          id="submit"
          disabled={!handleSubmitBtn()}
          onClick={selectedFile ? handleSubmitWithFile : handleSubmit}
        >
          ?????? ??????
        </button>
      </div>
    </FormContainer>
  );
}

export default FreeWriting;
