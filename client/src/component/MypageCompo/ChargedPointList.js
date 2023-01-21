import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../store/slices/userInfo';
import axios from 'axios';

const EntireContainer = styled.div`
  border-left: 5px solid orange;
  border-right: 5px solid orange;
  background-color: white;
  height: 58%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  > div#paging {
    text-align: center;
    /* border: 1px dotted gray; */
    font-size: 1rem;
    > button {
      cursor: pointer;
    }
    > span {
      display: block;
      margin: 10px 0;
    }
  }
`;

const UlContainer = styled.ul`
  margin: 0;
  /* margin-top: 2%; */
  /* border: 3px solid skyblue; */
  height: 90%;
  min-width: 85%;
  list-style: none;
  padding: 2%;
  overflow: auto;
  > li.item {
    margin-bottom: 3%;
    > p {
      border: 1px solid black;
      margin: 0;
      padding: 1%;
      &.detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #eef27e;
      }
      > span {
        border: 1px solid black;
        background-color: white;
        padding: 2%;
        margin-right: 3%;
        white-space: nowrap;
      }
      > #coins {
        margin-left: 3%;
      }
    }
  }
`;

function Item({ data }) {
  const { point, createdAt } = data;
  return (
    <li className="item">
      <p className="createdAt">{createdAt}</p>
      <p className="detail">
        <FontAwesomeIcon id="coins" icon={faMoneyCheckDollar} size="2x" />
        <span>+ {point} P</span>
      </p>
    </li>
  );
}

function ChargedPointList() {
  const [current, setCurrent] = useState(1);
  const LIMIT = 5;
  const offset = current * LIMIT - LIMIT;
  const [pointList, setPointList] = useState([]);
  const totalCount = pointList.length;
  const totalPage = Math.ceil(totalCount / LIMIT) || 1;
  const { id: userId, accToken } = useSelector(selectUserInfo);

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
    console.log('포인트 충전 내역');
    axios
      .get(
        `${process.env.REACT_APP_SERVER_DEV_URL}/users/${userId}/point`,
        getConfig,
      )
      .then((res) => {
        console.log(res.data);
        const { paidPoint } = res.data;
        if (paidPoint) {
          setPointList([...pointList, ...paidPoint]);
        }
      })
      .catch((err) => err.response?.message && alert(err.response.message));
  }, []);

  return (
    <EntireContainer>
      <UlContainer>
        {pointList.slice(offset, offset + LIMIT).map((data) => (
          <Item key={data.id} data={data} />
        ))}
      </UlContainer>
      <div id="paging">
        <button id="prev" onClick={prevBtnClick} disabled={current === 1}>
          {'<<'}
        </button>
        <span>
          {current} / {totalPage}
        </span>
        <button
          id="next"
          onClick={nextBtnClick}
          disabled={current === totalPage}
        >
          {'>>'}
        </button>
      </div>
    </EntireContainer>
  );
}

export default ChargedPointList;
