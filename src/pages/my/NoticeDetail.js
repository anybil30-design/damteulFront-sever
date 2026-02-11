import React from 'react';

// goodsDetail에서 서식 가져다가 씁니다
function NoticeDetail(props) {
	return (
		<main>
			<section className='noticeDetail'
			// scss파일만들면 삭제예정
			style={{marginTop:'60px',gap:'0px'}}
			>
				<div className='postUser'>
					<p>관리자명</p>
				</div>

				<div className='mainImg swipeContainer'>
					<div className='goodsItem'>
						<img src='https://placehold.co/390x430' alt=''/>
					</div>
					<div className='goodsItem'>
						<img src='https://placehold.co/390x430' alt=''/>
					</div>
					<div className='goodsItem'>
						<img src='https://placehold.co/390x430' alt=''/>
					</div>
				</div>

				<div className='goodsInfo'>
					<h3>Title</h3>
					<p>00분전 &#10072; cate</p>
				</div>
				<div className='usedInfo'>
					<p>
						이벤트 문구 내용 들어가는 영역입니다.
					</p>
				</div>
			</section>
		</main>
	);
}

export default NoticeDetail;