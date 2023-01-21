import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../store/slices/userInfo';

const EntireContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  /* 모달 뒷배경 */
  background: rgba(0, 0, 0, 0.3);
  > div.content {
    /* width: 50vw; */
    padding: 2em;
    border-radius: 7px;
    background: white;
    position: relative;
    > span {
      font-size: 1.5rem;
      position: absolute;
      top: 5%;
      right: 3%;
      cursor: pointer;
      &.x-btn.loading {
        display: none;
      }
    }
  }
`;

export default function Modal({ content, handleBtnClick, role }) {
  const { showAlert } = useSelector(selectUserInfo);
  return (
    <EntireContainer className="modal">
      <div className={`content ${role}`}>
        <span
          className={showAlert ? 'x-btn loading' : 'x-btn'}
          onClick={handleBtnClick}
        >
          &times;
        </span>
        {content}
      </div>
    </EntireContainer>
  );
}
