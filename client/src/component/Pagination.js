import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  prev,
  next,
  markUp,
  markDowm,
  updateSearch,
  selectSearch,
} from '../store/slices/search';

const PageContainer = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  > li:not(:last-child) {
    /* margin-right: 10px; */
  }
  > li {
    cursor: pointer;
    /* border: 2px solid white; */
    border-radius: 3px;
    font-size: 1.3rem;
    &.page {
      padding: 0 8px;
      &:hover,
      &.selected {
        color: white;
        /* border: 2px solid #4bab13; */
        background-color: #4bab13;
        border-radius: 3px;
      }
    }
    &.prev {
      margin-right: 5px;
    }
    &.next {
      margin-left: 5px;
    }
  }
`;

function Pagination() {
  const dispatch = useDispatch();
  const { page, totalPage, mark, markLIMIT } = useSelector(selectSearch);

  const pagingNumArr = Array.from({ length: totalPage }, (_, i) => i + 1);

  const markSTD = mark * markLIMIT;
  const markOffset = mark * markLIMIT - markLIMIT;

  useEffect(() => {
    if (page > markSTD) dispatch(markUp());
    if (page <= markOffset) dispatch(markDowm());
  }, [page]);

  return (
    <PageContainer className="paging">
      {page > 1 && (
        <li className="prev" onClick={() => dispatch(prev())}>
          {'<<'}
        </li>
      )}
      {pagingNumArr.slice(markOffset, markSTD).map((n) =>
        n === page ? (
          <li className="page selected">
            <b>{n}</b>
          </li>
        ) : (
          <li
            className="page"
            onClick={() =>
              dispatch(
                updateSearch({
                  page: n,
                }),
              )
            }
          >
            {n}
          </li>
        ),
      )}
      {page < totalPage && (
        <li className="next" onClick={() => dispatch(next())}>
          {'>>'}
        </li>
      )}
    </PageContainer>
  );
}

export default Pagination;
