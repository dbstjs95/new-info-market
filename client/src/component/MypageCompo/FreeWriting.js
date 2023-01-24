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

const WritingContainer = styled.div`
  border: 3px solid orange;
  background-color: white;
  height: 80%;
  width: 100%;
  border-radius: 10px;
  > form {
    /* border: 3px solid yellow; */
    height: 100%;
    width: 99%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > textarea {
      font-size: 1rem;
      width: 95%;
      padding: 1%;
      &#title {
        margin-top: 2%;
        margin-bottom: 2%;
        height: 2rem;
        /* resize: none;
        overflow: hidden; */
      }
      &#content {
        flex-grow: 1;
      }
    }
    > div.submit {
      margin-bottom: 10px;
      display: flex;
      width: 95%;
      justify-content: flex-end;
      align-items: center;
      /* border: 1px solid green; */
      > span.msg {
        display: none;
        &.alert {
          display: inline-block;
          color: red;
          font-size: 0.8rem;
        }
      }
      > button#submit {
        margin-left: 2%;
        font-size: 1rem;
        padding: 0.5em;
        background-color: #f5f5f5;
        border: 1px solid gray;
        cursor: pointer;
        @media screen and (max-width: 1024px) {
          font-size: 0.9rem;
        }
        @media screen and (max-width: 600px) {
          font-size: 0.8rem;
        }
      }
    }
  }
`;

const Btn = styled.button`
  &.need {
    display: none;
    color: red;
  }
`;

const FileBox = styled.div`
  /* border: 2px solid red; */
  width: 95%;
  margin: 10px 0;
`;

function Writing() {
  const accToken = localStorage.getItem('act');

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

  return (
    <form>
      <textarea
        name="title"
        id="title"
        rows="1"
        cols="1"
        placeholder="제목"
        maxlength="100" //삭제?
        value={textValues.title}
        onChange={(e) =>
          setTextValues({ ...textValues, title: e.target.value })
        }
      ></textarea>
      <textarea
        name="content"
        id="content"
        placeholder="공유할 정보에 대한 간단한 설명을 적어주세요."
        value={textValues.content}
        onChange={(e) =>
          setTextValues({ ...textValues, content: e.target.value })
        }
      ></textarea>
      <FileBox className="file-upload">
        <input
          type="file"
          // accept="image/*, .pdf, .hwp, application/vnd.ms-excel, text/plain, text/html"
          onChange={handleInputChange}
          ref={fileInput}
        />
        <Btn className={!selectedFile && 'need'} onClick={handleCancel}>
          파일 취소
        </Btn>
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
    </form>
  );
}

function FreeWriting() {
  const { isLogin } = useSelector(selectUserInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) return navigate('/main');
  }, []);

  return (
    <WritingContainer>
      <Writing />
    </WritingContainer>
  );
}

export default FreeWriting;
