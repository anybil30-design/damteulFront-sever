import React from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from "react-icons/fa6";
import './styles/support.css';


function Support(props) {
	return (
		<main>
			<section className='support'>
				<ul>
					<li>
						<Link to='/mypage/support/faq' title='자주 묻는 질문'>
							<p>자주 묻는 질문</p><FaAngleRight />
						</Link>
					</li>
					<li>
						<Link to='/mypage/support/contactus' title='일대일 문의'>
							<p>1:1 문의</p><FaAngleRight />
						</Link>
					</li>
					<li>
						<Link to='/mypage/support/reports' title='신고 내역 확인'>
							<p>신고 내역 확인</p><FaAngleRight />
						</Link>
					</li>
					<li>
						<Link to='/mypage/support/notice' title='공지사항'>
							<p>공지사항</p><FaAngleRight />
						</Link>
					</li>
				</ul>
			</section>
		</main>
	);
}

export default Support;