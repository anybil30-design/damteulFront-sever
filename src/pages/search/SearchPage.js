import React, {useState} from 'react';
import './styles/searchPage.css';
import { FaSearch } from "react-icons/fa";
export default function SearchPage (props){

  const [toggle,setToggle] =useState(1);

  return(
    <>
      <main className='searchPage'>
        <form>
          <label>검색창</label>
          <input type='search' placeholder='검색어를 입력해주세요' />
          <button type='button'><FaSearch /></button>
        </form>

        <ul className={`searchToggle ${toggle===1?'leftAct':'rightAct'}`}>
          <li>
            <button type='button'
            onClick={()=>setToggle(1)}
            className='goodsBtn'
            >중고상품</button>
          </li>

          <li>
            <button type='button'
            onClick={()=>setToggle(0)}
            className='nanumBtn'
            >나눔/이벤트</button>
            </li>
        </ul>
        
        <div className='searchRecent'>
          <p>최근 검색어</p>
          <button type='button'>전체 삭제</button>
        </div>

        <div className='searchContent'>
          <FaSearch />
          <span>검색어(예시)</span>
        </div>
      </main>
    </>
  );
}