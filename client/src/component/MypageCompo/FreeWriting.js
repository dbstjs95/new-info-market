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

  //파일 업로드 input
  const fileInput = useRef(null);

  //게시글 제목, 내용 입력값
  const [textValues, setTextValues] = useState({
    title: null,
    content: null,
    targetPoint: null,
  });

  //업로드할 파일 입력값
  const [selectedFile, setSelectedFile] = useState(null);

  //업로드 버튼 클릭(파일 없이)
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
        if (res.data.infoId) alert('글이 등록되었습니다.');
        setTextValues({
          title: '',
          content: '',
          targetPoint: '',
        });
        navigate('/mypage/info/myposts');
      })
      .catch((err) => {
        alert('서버 에러 발생! 다시 시도해주세요.');
      })
      .finally(() => setLoading(false));
  };

  //업로드 버튼 클릭(파일 업로드)
  const handleSubmitWithFile = (e) => {
    e.preventDefault();
    setLoading(true);
    const fileName = `info/${v4().toString().replaceAll('-', '')}.${
      selectedFile.type.split('/')[1]
    }`;

    const myBucket = new AWS.S3.ManagedUpload({
      params: {
        Bucket: S3_BUCKET, // 버킷 이름
        Key: fileName,
        Body: selectedFile, // 파일 객체
      },
    }).promise();

    myBucket
      .then(() => {
        //서버로 파일 경로 보내기.
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
            if (res.data.infoId) alert('글이 등록되었습니다.');
            setLoading(false);
            navigate('/mypage/info/myposts');
          })
          .catch((err) => {
            deleteFile(fileName);
            console.error(err);
            setLoading(false);
            alert('파일업로드 주소가 서버에 반영 안 됨.');
          });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        alert('파일 업로드에 실패했습니다.');
      });
  };

  //파일 삭제
  const deleteFile = (fileName) => {
    const myBucket = new AWS.S3();
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

  const handleSubmitBtn = () =>
    paid
      ? textValues.title && textValues.content && textValues.targetPoint
      : textValues.title && textValues.content;

  useEffect(() => {
    if (!accToken && !isLogin) return navigate('/main');
    if (paid && grade === 'Bronze') {
      alert('실버 등급부터 가능합니다.');
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
        placeholder="제목"
        maxLength="100"
        defaultValue={textValues?.title}
        onChange={(e) =>
          setTextValues({ ...textValues, title: e.target.value })
        }
      />
      <textarea
        name="content"
        id="content"
        placeholder="공유할 정보에 대한 간단한 설명을 적어주세요."
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
          파일 취소
        </span>
      </FileBox>
      {paid && (
        <input
          id="price"
          name="targetPoint"
          type="text"
          placeholder="가격"
          defaultValue={textValues?.targetPoint}
          onChange={(e) =>
            setTextValues({ ...textValues, targetPoint: e.target.value })
          }
        />
      )}
      <div className="submit">
        <span className={handleSubmitBtn() ? 'msg' : 'msg alert'}>
          {paid
            ? '제목, 내용, 가격 모두 작성해주세요.'
            : '제목과 내용 모두 작성해주세요.'}
        </span>
        <button
          id="submit"
          disabled={!handleSubmitBtn()}
          onClick={selectedFile ? handleSubmitWithFile : handleSubmit}
        >
          작성 완료
        </button>
      </div>
    </FormContainer>
  );
}

export default FreeWriting;
