import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import { useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';

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

const FormContainer = styled.form`
  /* border: 2px solid orange; */
  * {
    /* border: 1px solid red; */
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  margin: 0 auto;
  padding: 25px;
  /* box-shadow: inset 0 0 100px rgba(113, 6, 140, 0.5); */
  box-shadow: inset 0 0 100px rgba(133, 115, 34, 0.5);
  border-radius: 10px;
  > input#title,
  > textarea#content {
    padding: 10px;
    border: 2px solid lightgray;
    border-radius: 5px;
    box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);
  }
  > input#title {
    margin-bottom: 15px;
  }
  > textarea#content {
    min-height: 400px;
    margin-bottom: 30px;
    resize: none;
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

function FreeWriting() {
  const accToken = localStorage.getItem('act');
  const { isLogin } = useSelector(selectUserInfo);
  const navigate = useNavigate();

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //파일 업로드 input
  const fileInput = useRef(null);

  //게시글 제목, 내용 입력값
  const [textValues, setTextValues] = useState({
    title: null,
    content: null,
  });

  //업로드할 파일 입력값
  const [selectedFile, setSelectedFile] = useState(null);

  //업로드 버튼 클릭(파일 없이)
  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, content } = textValues;
    axios
      .post(
        `${process.env.REACT_APP_SERVER_DEV_URL}/info`,
        {
          type: 'Free',
          targetPoint: 0,
          title,
          content,
          file: '',
        },
        postConfig,
      )
      .then((res) => {
        if (res.data.infoId) alert('글이 등록되었습니다.');
        setTextValues({
          title: '',
          content: '',
        });
      })
      .catch((err) => {
        alert('서버 에러 발생! 다시 시도해주세요.');
      });
  };

  //업로드 버튼 클릭(파일 업로드)
  const handleSubmitWithFile = (e) => {
    e.preventDefault();
    //loading indicator 사용하기
    const fileName = `file/${v4().toString().replaceAll('-', '')}.${
      selectedFile.type.split('/')[1]
    }`;

    const params = {
      ACL: 'public-read-write',
      Body: selectedFile,
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    myBucket.putObject(params, (err, data) => {
      //서버로 파일 경로 보내주기.(일단 임시로 작성)
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info`,
          {
            type: 'Free',
            targetPoint: 0,
            ...textValues,
            file: fileName,
          },
          postConfig,
        )
        .then((res) => {
          setTextValues({
            title: '',
            content: '',
          });
          setSelectedFile('');
          fileInput.current.value = '';
          if (res.data.infoId) alert('글이 등록되었습니다.');
        })
        .catch((err) => {
          deleteFile(fileName);
          alert('파일업로드 주소가 서버에 반영 안 됨.');
        });
    });
  };

  //파일 삭제
  const deleteFile = (fileName) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: fileName,
    };

    myBucket.deleteObject(params, (err, data) => {
      if (data) console.log('s3파일 삭제');
      if (err) console.log('s3파일 삭제 실패');
    });
  };

  //파일 선택
  const handleInputChange = (e) => {
    // const fileObj = e.target.files[0];
    // const ext = fileObj.name.split('.').pop();
    setSelectedFile(e.target.files[0]);
  };

  //파일 선택 취소
  const handleCancel = (e) => {
    e.preventDefault();
    fileInput.current.value = null;
    setSelectedFile(null);
  };

  useEffect(() => {
    if (!accToken && !isLogin) return navigate('/main');
  }, []);

  return (
    <FormContainer>
      <input
        name="title"
        id="title"
        placeholder="제목"
        maxLength="100"
        defaultValue={textValues.title}
        onChange={(e) =>
          setTextValues({ ...textValues, title: e.target.value })
        }
      />
      <textarea
        name="content"
        id="content"
        placeholder="공유할 정보에 대한 간단한 설명을 적어주세요."
        defaultValue={textValues.content}
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
          파일 취소
        </span>
      </FileBox>
      <div className="submit">
        <span
          className={
            textValues.title && textValues.content ? 'msg' : 'msg alert'
          }
        >
          제목과 내용 모두 작성해주세요.
        </span>
        <button
          id="submit"
          disabled={!textValues.title || !textValues.content}
          onClick={selectedFile ? handleSubmitWithFile : handleSubmit}
        >
          작성 완료
        </button>
      </div>
    </FormContainer>
  );
}

export default FreeWriting;
