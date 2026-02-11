import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import './styles/writeBtn.css';
import { FaPlus } from "react-icons/fa6";


function WriteBtn(props) {

	const [isOpen, setIsOpen] = useState(false);
	
	return (
		<>
			<div className='writeBtn'
			onClick={()=>setIsOpen(!isOpen)}>
				<FaPlus fill='#fff'/>
			</div>
			{isOpen &&(
				<div className='writeCategory'>
				<Link to='/goodstrade' title='중고거래 글 작성하기'>중고거래</Link>
				<Link to='/nanumpost' title='나눔 글 작성하기'>나눔</Link>
				<Link to='/community/write' title='커뮤니티 글 작성하기'>커뮤니티</Link>
				</div>
			)}	

			{/* 일대일 문의 사항영역 추가 필요 */}
		</>
	);
}

export default WriteBtn;