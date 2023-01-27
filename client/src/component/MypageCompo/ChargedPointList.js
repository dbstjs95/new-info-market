import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import axios from 'axios';

const EntireContainer = styled.div``;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 50vh;
  padding: 10px;
  > div#paging {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 20%;
    min-width: 150px;
    color: #821e9c;
    font-weight: bold;
    font-size: 1.1rem;
    > button {
      cursor: pointer;
      background: transparent;
      border: 0;
      color: #821e9c;
      font-size: 1.3rem;
      &:disabled {
        opacity: 0;
      }
    }
  }
`;

const Table = styled.div`
  width: 100%;
  position: relative;
  margin: 25px auto;
  border-top: 2px solid #777;
  > table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    thead tr th {
      border-bottom: 1px solid #888;
      color: #71038c;
    }
    tbody tr td {
      border-bottom: 1px solid #efefef;
    }
    thead tr th,
    tbody tr td {
      text-align: left;
      padding: 10px;
      font-size: 15px;
      line-height: 0.9rem;

      /* desktop only */
      @media screen and (min-width: 991px) {
        padding: 12px 20px;
        font-size: 1rem;
        line-height: 22px;
      }
    }

    /* mobile only */
    @media screen and (max-width: 680px) {
      col {
        width: 100% !important;
      }
      thead {
        display: none;
      }
      tbody tr {
        border-bottom: 1px solid #efefef;
        td {
          width: 100%;
          display: flex;
          margin-bottom: 2px;
          padding: 5px;
          border-bottom: none;
          font-size: 14px;
          line-height: 18px;
          &:first-child {
            padding-top: 16px;
          }
          &:last-child {
            padding-bottom: 15px;
          }
          &::before {
            /* display: inline-block; */
            margin-right: 12px;
            -webkit-box-flex: 0;
            -ms-flex: 0 0 100px;
            flex: 0 0 100px;
            font-weight: 700;
            content: attr(data-label);
          }
        }
      }
    }
  }
`;

const NoFound = styled.div`
  font-family: '순천B';
  font-size: 20px;
  color: gray;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 5px dotted lightgray;
  word-break: break-all;
  @media screen and (max-width: 480px) {
    font-size: 17px;
  }
`;

function Item({ data }) {
  const { point, createdAt, payment_method_type, state } = data;
  return (
    <tr>
      <td scope="row" data-label="충전일">
        {createdAt}
      </td>
      <td scope="row" data-label="충전금액">
        {point}
      </td>
      <td data-label="방식">{payment_method_type}</td>
      <td data-label="결제방법">카카오페이</td>
      <td data-label="상태">{state}</td>
    </tr>
  );
}

function ChargedPointList() {
  const [current, setCurrent] = useState(1);
  const LIMIT = 5;
  const offset = current * LIMIT - LIMIT;
  const [pointList, setPointList] = useState([]);
  const totalCount = pointList.length;
  const totalPage = Math.ceil(totalCount / LIMIT) || 1;
  const { id: userId } = useSelector(selectUserInfo);
  const accToken = localStorage.getItem('act');

  const getConfig = {
    headers: {
      Authorization: `Bearer ${accToken}`,
    },
    withCredentials: true,
  };

  const prevBtnClick = (e) => {
    e.preventDefault();
    setCurrent(current - 1);
  };
  const nextBtnClick = (e) => {
    e.preventDefault();
    setCurrent(current + 1);
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/${userId}/point`,
        getConfig,
      )
      .then((res) => {
        const { paidPoint } = res.data;
        if (paidPoint) {
          setPointList([...pointList, ...paidPoint]);
        }
      })
      .catch(
        (err) =>
          err.response?.data?.message && alert(err.response.data.message),
      );
  }, []);

  return (
    <EntireContainer>
      {pointList?.length === 0 ? (
        <NoFound>충전한 기록이 없습니다 {':('}</NoFound>
      ) : (
        <Wrapper>
          <Table>
            <table>
              <colgroup>
                <col style={{ width: '30%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '20%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>충전일</th>
                  <th>충전금액</th>
                  <th>방식</th>
                  <th>결제방법</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {pointList?.slice(offset, offset + LIMIT)?.map((data) => (
                  <Item key={data.id} data={data} />
                ))}
              </tbody>
            </table>
          </Table>
          <div id="paging">
            <button disabled={current === 1} onClick={prevBtnClick}>
              <FontAwesomeIcon icon={faCircleLeft} />
            </button>
            <span>
              {current} / {totalPage}
            </span>
            <button onClick={nextBtnClick} disabled={current === totalPage}>
              <FontAwesomeIcon icon={faCircleRight} />
            </button>
          </div>
        </Wrapper>
      )}
    </EntireContainer>
  );
}

export default ChargedPointList;
