import React from 'react';
import styled from 'styled-components';

const EntireContainer = styled.div`
  border-left: 5px solid orange;
  border-right: 5px solid orange;
  background-color: white;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: gray;
  font-size: 20px;
`;

function RefundList() {
  return <EntireContainer>비활성 페이지입니다.</EntireContainer>;
}

export default RefundList;
