import React, {useState} from 'react';
import './styles/submitReport.css';
import { useNavigate } from 'react-router-dom';

function SubmitReport(props) {
	const [report, setReport] = useState('');
	const navigate = useNavigate();

	return (
		<main>
			<section className='submitReport'>
				<h3>게시글을 신고하는 이유를 선택해주세요.</h3>
				<ul>
					<li onClick={()=>setReport('1')}
						className={report==='1'?'reasonActive':''}>
						<p>거래 금지 물품이에요.</p>
					</li>
					<li onClick={()=>setReport('2')}
						className={report==='2'?'reasonActive':''}>
						<p>판매업자 같아요.</p>
					</li>
					<li onClick={()=>setReport('3')}
						className={report==='3'?'reasonActive':''}>
						<p>사기가 의심돼요.</p>
					</li>
					<li onClick={()=>setReport('4')}
						className={report==='4'?'reasonActive':''}>
						<p>담뜰의 다른 서비스에 등록되어야 하는 글이에요.</p>
					</li>
					<li onClick={()=>setReport('5')}
						className={report==='5'?'reasonActive':''}>
						<p>부적절한 행위가 있어요</p>
					</li>
				</ul>
				<button>신고하기</button>
			</section>
			<div className='deletePopup'>
				<div className='deleteModal'>
					<p>신고접수가 완료되었습니다.</p>
					<div className='deleteBtn'>
						<button onClick={()=>navigate(-1)}>확인</button>
					</div>
				</div>
			</div>
		</main>
	);
}

export default SubmitReport;