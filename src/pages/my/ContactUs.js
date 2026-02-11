import SupportList from 'components/SurpportList/SupportList';
import WriteBtn from 'components/writeBtn/WriteBtn';
import React from 'react';
import { Link } from 'react-router-dom';

// 나중에 삭제
const contactData = [
  {
    id: 1,
    cate: "결제",
    title: "중복 결제가 되었는데 취소하고 싶어요.",
    content: "어제 물건을 구매했는데 결제가 두 번 되었습니다. 하나는 취소해주시고 확인 부탁드려요.",
    answer:"내용 확인 후 다시 답변드리겠습니다.",
    date: "2026-01-28"
  },
  {
    id: 2,
    cate: "계정",
    title: "비밀번호 변경이 안 됩니다.",
    content: "비밀번호 변경 링크를 눌렀는데 계속 오류 페이지가 뜹니다. 어떻게 해야 하나요?",
    answer:"내용 확인 후 다시 답변드리겠습니다.",
    date: "2026-01-27"
  },
  {
    id: 3,
    cate: "기타",
    title: "서비스 이용 중 불편한 점이 있습니다.",
    content: "채팅 알림이 가끔씩 안 들어오는데 앱 설정 문제인지 확인 부탁드립니다.",
    answer:"내용 확인 후 다시 답변드리겠습니다.",
    date: "2026-01-26"
  }
];


function ContactUs(props) {
	return (
		<main>
			<SupportList data={contactData}/>
			<Link to='' title='문의 글 쓰기'>
			<WriteBtn />
			</Link>
		</main>
	);
}

export default ContactUs;