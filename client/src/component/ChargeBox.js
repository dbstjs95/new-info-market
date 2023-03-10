import styled from 'styled-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, updateState } from '../store/slices/userInfo';
import {
  selectSelectedPost,
  updatePostState,
} from '../store/slices/selectedPost';
import { selectPoint, inputPayment, confirmPay } from '../store/slices/point';
import Payment from './Payment';
import axios from 'axios';

const ChargeBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0px 30px;
  > p.header {
    font-weight: bold;
    padding-bottom: 5px;
    margin-bottom: 15px;
    border-bottom: 2px solid #555;
  }
  > input {
    font-size: 1rem;
    padding: 5px;
  }
  > button {
    font-size: 0.9rem;
    padding: 7px;
    background-color: #30302d;
    color: white;
    border-radius: 5px;
  }
  > p.standard {
    font-size: 0.9rem;
    margin-bottom: 20px;
    color: crimson;
  }
`;

const PayBox = styled.div`
  /* height: 150px; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 35px;
  > span {
    font-size: 0.9rem;
    margin-bottom: 10px;
    color: #555;
  }
  > p {
    line-height: 1.8rem;
    font-weight: bold;
    color: #333;
    &:first-of-type {
      text-decoration: crimson wavy underline;
    }
  }
  > div.btns {
    margin-top: 20px;
    align-self: flex-end;
    button {
      font-weight: bold;
      cursor: pointer;
      border: 0;
      color: white;
      background-color: #ed0c2a;
      padding: 2px;
      &:nth-child(1) {
        background-color: #3b3bcc;
        margin-right: 20px;
      }
      &:hover {
        box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
      }
    }
  }
`;

export function PayWithPoints({ handleClick }) {
  const dispatch = useDispatch();
  const { targetPoint, id: infoId } = useSelector(selectSelectedPost);
  const { payNow } = useSelector(selectPoint);
  const { id: userId, point } = useSelector(selectUserInfo);
  const accToken = localStorage.getItem('act');

  const postConfig = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  //?????? ?????? --> ?????? ??????(????????? ??????)
  useEffect(() => {
    const restPoint = Number(point) - Number(targetPoint);
    if (payNow) {
      //loading indicator start
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/info/${infoId}/order`,
          { restPoint, userId },
          postConfig,
        )
        .then((res) => {
          dispatch(updateState({ point: restPoint }));
          dispatch(updatePostState({ isPurchased: true }));
          alert('?????? ??????');
        })
        .catch((err) => alert('?????? ??????'));
      //loading indicator end
      handleClick(); //ContentPaid??? preStep --> false
      dispatch(
        confirmPay({
          answer: false,
        }),
      );
    }
  }, [payNow]);

  //point slice: payNow --> true, ContentPaid: preStep --> false
  const yes = () => {
    dispatch(
      confirmPay({
        answer: true,
      }),
    );
  };

  return (
    <PayBox>
      <span>?????? ??????: {point}</span>
      <p>{targetPoint} P??? ???????????????.</p>
      <p>?????????????????????????</p>
      <div className="btns">
        <button onClick={yes}>??????</button>
        <button onClick={handleClick}>??????</button>
      </div>
    </PayBox>
  );
}

export default function ChargeBox() {
  const dispatch = useDispatch();
  const { phone, email } = useSelector(selectUserInfo);

  return (
    <ChargeBoxContainer className="charge-box">
      <p className="header">???????????? {'>'} ???????????????</p>
      <input
        placeholder="?????? ??????"
        type="number"
        min="3000"
        step="1000"
        onChange={(e) =>
          dispatch(
            inputPayment({
              amount: e.target.value,
              buyer_tel: phone,
              buyer_email: email,
            }),
          )
        }
      />
      <p className="standard">3000??? ???????????? ???????????????.</p>
      <Payment />
    </ChargeBoxContainer>
  );
}
