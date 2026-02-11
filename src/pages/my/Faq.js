import React from 'react';
import SupportList from '../../components/SurpportList/SupportList';

// 더미데이터 추후 삭제예정
const faqData = [
  {
    id: 1,
    cate: "계정",
    title: "초록지수 올리는 방법이 궁금해요",
    content: "제곧내",
    answer:"성실한 거래와 깨끗한 매너를 유지하시면 지수가 올라갑니다.",
    date: "2026-01-28"
  },
  {
    id: 2,
    cate: "결제",
    title: "환불 규정은 어떻게 되나요?",
    content:"제품을 구매했는데 흠집이 있어서 환불하고 싶어요.",
    answer: "구매 후 7일 이내, 사용하지 않은 상품에 한해 환불이 가능합니다.",
    date: "2026-01-27"
  },
  {
    id: 3,
    cate: "이용",
    title: "게시글이 삭제되었습니다.",
    content:"글 올린지 얼마 안됐는데 제가 올린 글이 안보여요.",
    answer: "커뮤니티 가이드라인을 위반한 경우 게시글이 자동으로 블라인드 처리될 수 있습니다.",
    date: "2026-01-25"
  }
];

function Faq(props) {
	return (
		<main>
			<SupportList data={faqData} />
		</main>
	);
}

export default Faq;