// import React, {useState} from 'react';
// import './styles/search.css';
// import { FaSearch } from "react-icons/fa";


// const Search = () => {

//   const [search, setSearch] = useState('used');

//   return (
//     <main>
//       <section className='search'>
//         {/* 검색바 영역 */}
//         <p className='searchBar'>
//         <label htmlFor='userSearch'>검색하기</label>
//         <input type='search'
//         aria-label='검색하기'
//         id='userSearch'/>
//         <button className='searchBtn' type='search'>
//           <FaSearch />
//         </button>
//         </p>
//         {/* 중고상품, 나눔/이벤트 탭 */}
//         <div className='searchTab'>
//           {/* myTabMenu서식은 MybuynSell 참조 */}
//           <ul className='myTabMenu'>
//             <li onClick={()=>setSearch('used')}
//               className={search==='used'?'active':''}>중고상품</li>
//             <li onClick={()=>setSearch('event')}
//               className={search==='event'?'active':''}>나눔/이벤트</li>
//           </ul>

//           {/* 최근 검색어 나올영역 localstorage */}
//           <p>최근 검색어</p>
//           <div className='recentSearch'>
//             <FaSearch />
//             <span>검색어 키워드</span>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Search;