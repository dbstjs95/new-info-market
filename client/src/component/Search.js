import styled from 'styled-components';
import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import QueryString from 'qs';
import { reset } from '../store/slices/search';

const boxShadow = '0 4px 6px rgb(32 33 36 / 28%)';

export const InputContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0 0;
  > form {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 3px dotted #999;
    padding: 5px;
    /* &:focus-within {
      box-shadow: ${boxShadow};
    } */
    > select,
    > input,
    > span#search-icon {
      height: 40px;
    }
    > select {
      width: 13%;
      font-size: 1rem;
      border-radius: 5px;
      padding: 3px;
      margin-right: 3px;
      outline: none;
      background-color: white;
      /* line-height: 1.5em; */
    }
    > input {
      width: 60%;
      font-size: 1.1rem;
      padding: 7px;
      border: 0;
      margin: 0 10px;
      box-shadow: 0 0 5px 3px rgba(186, 222, 4, 0.6);
    }
    > span#search-icon {
      width: 7%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: transparent;
      color: #107020;
      font-size: 1.7rem;
    }

    @media screen and (max-width: 700px) {
      > select {
        font-size: 0.9rem;
      }
      > input {
        font-size: 1rem;
      }
      > span#search-icon {
        font-size: 1.5rem;
      }
    }

    @media screen and (max-width: 480px) {
      > select {
        display: none;
      }
      > input {
        width: 90%;
      }
      > span#search-icon {
        width: 10%;
      }
    }
  }
`;

function SelectBox({ items, className, selectVal, handleSelect }) {
  return (
    <select name="filter" value={selectVal} onChange={handleSelect}>
      {items.map(([name, value], i) => (
        <option key={i} value={value}>
          {name}
        </option>
      ))}
    </select>
  );
}

export default function Search({ single }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [localIpVal, setLocalIpVal] = useState('');
  const [localSelec1, setLocalSelec1] = useState('title');
  const [localSelec2, setLocalSelec2] = useState('All');
  const buttonEl = useRef(null);

  useEffect(() => {
    const { search_type, info_type, input_value } = QueryString.parse(
      location.search,
      {
        ignoreQueryPrefix: true,
      },
    );

    if (search_type) setLocalSelec1(search_type);
    if (info_type) setLocalSelec2(info_type);
    if (input_value) setLocalIpVal(input_value);
  }, []);

  const handleKeyPress = (e) => {
    // e.preventDefault();
    if (e.key === 'Enter') buttonEl.current.click();
  };

  const handleSelect1 = (e) => {
    setLocalSelec1(e.target.value);
  };

  const handleSelect2 = (e) => {
    setLocalSelec2(e.target.value);
  };

  const searchClick = (e) => {
    e.preventDefault();
    console.log('클릭');
    console.log(localIpVal);
    if (!localIpVal) return alert('검색어가 없습니다.');
    dispatch(reset());
    navigate(
      `/main/search?search_type=${localSelec1}&info_type=${localSelec2}&input_value=${localIpVal}`,
    );
  };

  return single ? (
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
  ) : (
    <InputContainer className="bar">
      <form>
        <SelectBox
          handleSelect={handleSelect1}
          selectVal={localSelec1}
          className="selet-box first"
          items={[
            ['제목', 'title'],
            ['내용', 'content'],
            ['작성자', 'nickname'],
          ]}
          role="first"
        />
        <SelectBox
          handleSelect={handleSelect2}
          selectVal={localSelec2}
          className="selet-box second"
          items={[
            ['전체', 'All'],
            ['무료', 'Free'],
            ['유료', 'Paid'],
          ]}
          role="second"
        />
        <input
          type="search"
          placeholder="검색어를 입력하세요."
          value={localIpVal}
          onChange={(e) => setLocalIpVal(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <span
          id="search-icon"
          // type="submit"
          ref={buttonEl}
          onClick={searchClick}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
      </form>
    </InputContainer>
  );
}
