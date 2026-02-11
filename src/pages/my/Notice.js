import SupportList from 'components/SurpportList/SupportList';
import React from 'react';
import { Link } from 'react-router-dom';

const noticeData = [
  {
    id: 1,
    cate: "점검",
    title: "시스템 정기 점검 안내 (02/01)"
  },
  {
    id: 2,
    cate: "이벤트",
    title: "설날 맞이 포인트 증정 이벤트 안내"
  },
  {
    id: 3,
    cate: "업데이트",
    title: "버전 1.2.0 업데이트 및 신규 기능 추가 안내"
  }
];

function Notice(props) {
	return (
		<main>
			<Link to='/mypage/support/notice/noticedetail' title='공지사항 상세페이지로 이동'>
			<SupportList data={noticeData} type='notice' />
			</Link>
		</main>
	);
}

export default Notice;