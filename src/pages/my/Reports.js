import SupportList from 'components/SurpportList/SupportList';
import React from 'react';

const reportData = [
  {
    id: 1,
    cate: "비매너",
    title: "상대방의 지속적인 비속어 사용",
    content: "거래 진행 중 상대방이 이유 없이 비속어를 사용하고 위협적인 태도를 보였습니다. 조치 부탁드립니다.",
    answer:"확인했습니다. 조치 후 답변드리겠습니다.",
    date: "2026-01-28"
  },
  {
    id: 2,
    cate: "사기",
    title: "입금 후 연락 두절",
    content: "물건 값을 입금했는데 이후 상대방이 메시지를 읽지 않고 연락이 되지 않습니다.",
    answer:"확인했습니다. 조치 후 답변드리겠습니다.",
    date: "2026-01-27"
  },
  {
    id: 3,
    cate: "허위매물",
    title: "사진과 실제 물건 상태가 다름",
    content: "올라온 사진은 새 제품이었으나 실제로 받아보니 오염이 심한 중고 제품이었습니다.",
    answer:"확인했습니다. 조치 후 답변드리겠습니다.",
    date: "2026-01-26"
  }
];

function Reports(props) {
	return (
		<main>
			<SupportList data={reportData}/>
		</main>
	);
}

export default Reports;