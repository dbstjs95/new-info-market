import React from 'react';
import styled from 'styled-components';

const EntireContainer = styled.div`
  min-height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 20px;
  border: 5px dotted lightgray;
  word-break: break-all;
  @media screen and (max-width: 480px) {
    font-size: 17px;
  }
`;

function RefundList() {
  return <EntireContainer>비활성 페이지입니다.</EntireContainer>;
}

export default RefundList;
