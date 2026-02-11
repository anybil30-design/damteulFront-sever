import React from 'react';
import { FaSearch } from "react-icons/fa";
import './styles/searchBar.css';
import { Link } from 'react-router-dom';

function SearchBar(props) {
	return (
		<Link className='searchBar' to='/search' title='검색페이지로 이동'>
			<label htmlFor='userSearch'>검색하기</label>
			<input type='search'
			aria-label='검색하기'
			id='userSearch'/>
				<button className='searchBtn' type='search'>
					<FaSearch />
				</button>
		</Link>
	);
}

export default SearchBar;