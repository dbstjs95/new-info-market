import styled from 'styled-components';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { selectSearch, updateSearch } from '../store/slices/search';
import { useNavigate } from 'react-router-dom';
import Img from '../images/info2.jpg';
import '../css/Main.css';

const boxShadow = '0 4px 6px rgb(32 33 36 / 28%)';
// const activeBorderRadius = '1rem 1rem 0 0';
// const inactiveBorderRadius = '1rem 1rem 1rem 1rem';

export const InputContainer = styled.div`
  border: 5px solid gray;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2%;
  > form {
    flex: 1 1 auto;
    border-radius: 30px;
    padding: 1.5%;
    display: flex;
    align-items: center;
    &:focus-within {
      box-shadow: ${boxShadow};
    }
    > select {
      font-size: 1rem;
      flex: 1;
    }
    > span {
      display: flex;
      flex: 9;
      margin-left: 5px;
      margin-right: 10px;
      justify-content: center;
      align-items: center;
      > input {
        font-size: 1rem;
        flex: 1;
      }
      > #delete-button {
        font-size: 1.3rem;
        cursor: pointer;
      }
    }
    > button#search-icon {
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
      font-size: 1.3rem;
      cursor: pointer;
    }
  }

  /* width: 50%;
  margin: 0 auto;
  border-radius: 50px;
  margin-top: 8rem;
  background-color: #f7f7f7;
  display: flex;
  padding: 1rem;
  border: 1px solid rgb(223, 225, 229);
  z-index: 3;

  > input {
    flex: 1 0 0;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0;
    padding-left: 12px;
    outline: none;
    font-size: 16px;
  }
  > div.delete-button {
    cursor: pointer;
  } */
`;

function SelectBox({ items, className, role }) {
  const dispatch = useDispatch();
  const { selectBox1, selectBox2 } = useSelector(selectSearch);

  const handleSelect = (e) => {
    if (role === 'first') {
      dispatch(
        updateSearch({
          selectBox1: e.target.value,
        }),
      );
    } else {
      dispatch(
        updateSearch({
          selectBox2: e.target.value,
        }),
      );
    }
  };

  return (
    <select
      name="filter"
      value={role === 'first' ? selectBox1 : selectBox2}
      onChange={handleSelect}
    >
      {items.map(([name, value], i) => (
        <option key={i} value={value}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default function Search({ single }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inputVal } = useSelector(selectSearch);

  const buttonEl = useRef(null);

  const handleKeyPress = (e) => {
    // e.preventDefault();
    if (e.key === 'Enter') buttonEl.current.click();
  };

  const inputChange = (e) => {
    dispatch(
      updateSearch({
        inputVal: e.target.value,
      }),
    );
  };

  const searchClick = (e) => {
    e.preventDefault();
    if (!inputVal) return alert('검색어가 없습니다.');
    navigate('/main/search');
  };

  return single ? (
    <div className="main-container">
      <InputContainer className="bar">
        {/* <form>
        <SelectBox
        value={searchOptions.selectValue}
          className="selet-box second"
          items={[
            ['전체', 'All'],
            ['무료', 'Free'],
            ['유료', 'Paid'],
          ]}
          handleSelect={handleSelect}
          />
          <span>
          <input
          type="search"
          placeholder="검색어를 입력하세요."
          onChange={(e) => handleInputChange(e.target.value)}
          value={searchOptions.inputValue}
          onKeyPress={handleKeyPress}
          />
          </span>
          <button
          id="search-icon"
            type="submit"
            ref={buttonEl}
            onClick={(e) => searchClick(e)}
            >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form> */}
      </InputContainer>
    </div>
  ) : (
    <div className="main-container">
      <img className="main-img" src={Img} />
      <div className="main-input">
        <p>텍스트 테스트</p>
      </div>
      <InputContainer className="bar">
        <form>
          <SelectBox
            className="selet-box first"
            items={[
              ['제목', 'title'],
              ['내용', 'content'],
              ['작성자', 'nickname'],
            ]}
            role="first"
          />
          <SelectBox
            className="selet-box second"
            items={[
              ['전체', 'All'],
              ['무료', 'Free'],
              ['유료', 'Paid'],
            ]}
            role="second"
          />
          <span>
            <input
              type="search"
              placeholder="검색어를 입력하세요."
              value={inputVal}
              onChange={inputChange}
              onKeyPress={handleKeyPress}
            />
          </span>
          <button
            id="search-icon"
            type="submit"
            ref={buttonEl}
            onClick={searchClick}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>
      </InputContainer>
    </div>
  );
}
