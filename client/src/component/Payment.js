import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPoint,
  updatePointState,
  initPayment,
} from '../store/slices/point';
import { updateState, selectUserInfo } from '../store/slices/userInfo';
import { v4 } from 'uuid';

const Payment = (effect, deps) => {
  const dispatch = useDispatch();
  const { paymentInput, modalOpen } = useSelector(selectPoint);
  const { accToken, point } = useSelector(selectUserInfo);
  const { amount, buyer_tel, buyer_email } = paymentInput;

  const config = {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const onClickPayment = () => {
    if (Number(amount) < 3000) return;
    dispatch(
      updatePointState({
        modalOpen: false,
      }),
    );

    const { IMP } = window;
    IMP.init(process.env.REACT_APP_IMP_CODE); // 가맹점 식별코드 // 결제 데이터 정의
    const data = {
      pg: 'kakaopay', // PG사 (필수항목)
      pay_method: 'card', // 결제수단 (필수항목)
      merchant_uid: `mid_${new Date().getTime()}` + v4(), // 결제금액 (필수항목)
      name: '인포마켓 포인트 ', // 주문명 (필수항목)
      amount, // 금액 (필수항목)
      buyer_tel, // 구매자 전화번호 (필수항목)
      buyer_email, // 구매자 이메일
    };
    IMP.request_pay(data, callback);
  };

  const callback = (response) => {
    const {
      success,
      error_msg,
      imp_uid,
      merchant_uid,
      pay_method,
      paid_amount,
      status,
    } = response;
    if (success) {
      //여기에 서버로 결제 정보 보내주면 됨.
      axios
        .post(
          `${process.env.REACT_APP_SERVER_DEV_URL}/point/approve`,
          {
            imp_uid,
            merchant_uid,
            pay_method,
            amount: paid_amount,
            status,
          },
          config,
        )
        .then((res) => {
          dispatch(updateState({ point: Number(point) + Number(amount) }));
          alert('포인트를 충전했습니다.');
        })
        .catch((err) => {
          if (err.response?.message) alert(err.response.message);
        });
    } else {
      dispatch(initPayment());
      alert(`포인트 충전 실패 : ${error_msg}`);
    }
  };

  return <button onClick={onClickPayment}>결제하기</button>;
};

export default Payment;
