import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  updatePostState,
  selectSelectedPost,
} from '../../store/slices/selectedPost';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';

const ACCESS_KEY = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_AWS_DEFAULT_REGION;
const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET;

// aws 설정
AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  apiVersion: '2006-03-01',
});

// css
const FileUplaodBox = styled.div`
  * {
    font-size: 0.9rem;
  }
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > input {
  }
  > span {
    color: crimson;
  }
  @media screen and (max-width: 350px) {
    flex-direction: column;
    align-items: flex-start;
    > input {
      width: 100%;
    }
    span {
      margin-top: 10px;
      align-self: flex-end;
    }
  }
`;

export default function FileChange() {
  const dispatch = useDispatch();
  const { modifyFileStep, fileURL } = useSelector(selectSelectedPost);

  const [selectedFile, setSelectedFile] = useState('');

  //파일 업로드 input
  const fileInput = useRef(null);

  //파일 변경이 있을 때 s3에 새로운 파일을 올리고, 기존파일을 삭제해야 함.
  useEffect(() => {
    if (!modifyFileStep) return;

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
        setSelectedFile('');
        dispatch(
          updatePostState({
            modyfiedFileName: fileName,
            modifyFileStep: false,
            modifyTextStep: true,
          }),
        );
      })
      .catch((err) => {
        console.error(err);
        alert('파일 업로드에 실패했습니다.');
      });
  }, [modifyFileStep]);

  //파일 선택
  const handleInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
    dispatch(
      updatePostState({
        fileChange: true,
      }),
    );
  };

  //파일 선택 취소
  const handleCancel = (e) => {
    e.preventDefault();
    fileInput.current.value = null;
    setSelectedFile('');
    dispatch(
      updatePostState({
        fileChange: false,
      }),
    );
  };

  return (
    //파일 입력 폼
    <FileUplaodBox>
      <input type="file" onChange={handleInputChange} ref={fileInput} />
      {selectedFile && <span onClick={handleCancel}>파일취소</span>}
    </FileUplaodBox>
  );
}
